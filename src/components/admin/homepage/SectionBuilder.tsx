'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, GripVertical, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddSectionModal } from './AddSectionModal';
import { SectionEditorPanel } from './SectionEditorPanel';
import { HomepageSection } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface SectionBuilderProps {
  sections: HomepageSection[];
  onChange: (sections: HomepageSection[]) => void;
}

export function SectionBuilder({ sections, onChange }: SectionBuilderProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  // Handle drag end
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order field
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    onChange(updatedItems);
  }

  // Add new section
  function handleAddSection(section: HomepageSection) {
    const newSection = {
      ...section,
      order: sections.length,
    };
    onChange([...sections, newSection]);
    setSelectedSectionId(newSection.id);
    setIsAddModalOpen(false);
  }

  // Update section
  function handleUpdateSection(updatedSection: HomepageSection) {
    const updatedSections = sections.map((s) =>
      s.id === updatedSection.id ? updatedSection : s
    );
    onChange(updatedSections);
  }

  // Toggle section enabled
  function handleToggleEnabled(id: string) {
    const updatedSections = sections.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    onChange(updatedSections);
  }

  // Duplicate section
  function handleDuplicate(section: HomepageSection) {
    const newSection = {
      ...section,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${section.name} - Copy`,
      order: sections.length,
    };
    onChange([...sections, newSection]);
  }

  // Delete section
  function handleDelete(id: string) {
    if (!confirm('Delete this section?')) return;
    
    const updatedSections = sections
      .filter((s) => s.id !== id)
      .map((s, index) => ({ ...s, order: index }));
    
    onChange(updatedSections);
    
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
    }
  }

  return (
    <div className="flex gap-6">
      {/* Left: Section List */}
      <div className="w-80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sections</h3>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {sections.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No sections yet. Click "Add" to get started.
            </p>
          </Card>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {sections.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            'cursor-pointer transition-all',
                            selectedSectionId === section.id &&
                              'ring-2 ring-primary',
                            snapshot.isDragging && 'shadow-lg',
                            !section.enabled && 'opacity-50'
                          )}
                          onClick={() => setSelectedSectionId(section.id)}
                        >
                          <div className="flex items-center gap-3 p-3">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>

                            {/* Section Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {section.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {section.type}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleEnabled(section.id);
                                }}
                              >
                                {section.enabled ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicate(section);
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(section.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Right: Section Editor */}
      <div className="flex-1">
        {selectedSection ? (
          <SectionEditorPanel
            section={selectedSection}
            onChange={handleUpdateSection}
            onDelete={() => handleDelete(selectedSection.id)}
            onDuplicate={() => handleDuplicate(selectedSection)}
          />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Select a section to edit or add a new one
            </p>
          </Card>
        )}
      </div>

      {/* Add Section Modal */}
      <AddSectionModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSection}
      />
    </div>
  );
}

