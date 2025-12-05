'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { commentInputSchema, type CommentInput } from '@/lib/schemas/comment';
import { Loader2, Send } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: Partial<CommentInput>;
}

export function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  defaultValues,
}: CommentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentInput>({
    resolver: zodResolver(commentInputSchema),
    defaultValues: {
      postId,
      parentId,
      ...defaultValues,
    },
  });

  const onSubmit = async (data: CommentInput) => {
    if (!isCaptchaSolved || !captchaToken) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng hoàn thành CAPTCHA',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          postId,
          parentId: parentId || undefined,
          // captchaToken sẽ được verify ở server-side (nếu cần)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error?.message || 'Có lỗi xảy ra khi gửi bình luận'
        );
      }

      // Success
      toast({
        title: 'Thành công',
        description:
          result.data?.comment?.status === 'approved'
            ? 'Bình luận đã được đăng thành công'
            : 'Bình luận đã được gửi và đang chờ duyệt',
        variant: 'success',
      });

      // Reset form
      reset();
      setCaptchaToken(null);
      setIsCaptchaSolved(false);

      // Callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: 'Lỗi',
        description:
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi gửi bình luận',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setIsCaptchaSolved(true);
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setIsCaptchaSolved(false);
    toast({
      title: 'Lỗi CAPTCHA',
      description: 'Vui lòng thử lại',
      variant: 'destructive',
    });
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    setIsCaptchaSolved(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="authorName">
            Tên của bạn <span className="text-red-500">*</span>
          </Label>
          <Input
            id="authorName"
            placeholder="Nhập tên của bạn"
            {...register('authorName')}
            disabled={isSubmitting}
          />
          {errors.authorName && (
            <p className="text-sm text-red-500">{errors.authorName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="authorEmail">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="authorEmail"
            type="email"
            placeholder="email@example.com"
            {...register('authorEmail')}
            disabled={isSubmitting}
          />
          {errors.authorEmail && (
            <p className="text-sm text-red-500">
              {errors.authorEmail.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">
          Bình luận <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Viết bình luận của bạn..."
          rows={5}
          {...register('content')}
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Tối thiểu 10 ký tự, tối đa 2000 ký tự
        </p>
      </div>

      {/* Cloudflare Turnstile CAPTCHA */}
      <div className="flex justify-center">
        <Turnstile
          siteKey={
            process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
            '1x00000000000000000000AA' // Cloudflare Turnstile Test Key (always passes)
          }
          onSuccess={handleCaptchaSuccess}
          onError={handleCaptchaError}
          onExpire={handleCaptchaExpire}
          options={{
            theme: 'light',
            size: 'normal',
          }}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={!isCaptchaSolved || isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {parentId ? 'Gửi phản hồi' : 'Gửi bình luận'}
            </>
          )}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
        )}
      </div>

      {!isCaptchaSolved && (
        <p className="text-sm text-gray-500 text-center">
          Vui lòng hoàn thành CAPTCHA để gửi bình luận
        </p>
      )}
    </form>
  );
}

