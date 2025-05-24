// Add react-dnd dependencies: npm install react-dnd react-dnd-html5-backend
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Section Draggable Component
const DraggableSection = ({ section, index, moveSection, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SECTION',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      {children}
    </div>
  );
};

// In main component:
const moveSection = (fromIndex, toIndex) => {
  setCourse(prev => {
    const newSections = [...prev.sections];
    const [removed] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, removed);
    return { ...prev, sections: newSections };
  });
};

// Wrap your sections list with DndProvider
<DndProvider backend={HTML5Backend}>
  {course.sections.map((section, sectionIndex) => (
    <DraggableSection 
      key={sectionIndex} 
      index={sectionIndex} 
      section={section}
      moveSection={moveSection}
    >
      {/* Existing section content */}
    </DraggableSection>
  ))}
</DndProvider>