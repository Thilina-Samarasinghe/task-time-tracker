'use client';

import { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useCategoryStore } from '@/store/categoryStore';
import { Task, Priority } from '@/types/task.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
}

export default function TaskForm({ task, onSuccess }: TaskFormProps) {
  const { createTask, updateTask } = useTaskStore();
  const { categories, fetchCategories, createCategory } = useCategoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || Priority.MEDIUM,
    categoryId: task?.categoryId || '',
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setIsCreatingCategory(true);
    try {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
        color: randomColor,
      });
      
      setFormData({ ...formData, categoryId: newCategory.id });
      setNewCategoryName('');
      setOpenCategory(false);
    } catch (error: any) {
      console.error('Failed to create category:', error);
      alert(error?.response?.data?.message || 'Failed to create category. It may already exist.');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        categoryId: formData.categoryId || undefined,
      };

      if (task) {
        await updateTask(task.id, submitData);
      } else {
        await createTask(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description (optional)"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Priority</label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Priority.LOW}>Low</SelectItem>
            <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={Priority.HIGH}>High</SelectItem>
            <SelectItem value={Priority.URGENT}>Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <Popover open={openCategory} onOpenChange={setOpenCategory}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={openCategory}
              className="w-full justify-between"
            >
              {selectedCategory ? (
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                  {selectedCategory.name}
                </span>
              ) : (
                "Select category..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search or create category..." 
                value={newCategoryName} 
                onValueChange={setNewCategoryName}
              />
              <CommandEmpty>
                <div className="p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={handleCreateCategory}
                    disabled={isCreatingCategory || !newCategoryName.trim()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {isCreatingCategory ? 'Creating...' : `Create "${newCategoryName}"`}
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="no-category"
                  onSelect={() => {
                    setFormData({ ...formData, categoryId: '' });
                    setOpenCategory(false);
                    setNewCategoryName('');
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      formData.categoryId === '' ? "opacity-100" : "opacity-0"
                    )}
                  />
                  No category
                </CommandItem>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      setFormData({ ...formData, categoryId: category.id });
                      setOpenCategory(false);
                      setNewCategoryName('');
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.categoryId === category.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
}