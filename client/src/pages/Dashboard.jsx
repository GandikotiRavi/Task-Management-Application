import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProjectHero from '../components/ProjectHero';
import TaskKanban from '../components/TaskKanban';
import TaskList from '../components/TaskList';
import TaskDetailDrawer from '../components/TaskDetailDrawer';
import TaskFormModal from '../components/TaskFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ToastContainer from '../components/ToastContainer';

const Dashboard = () => {
  const { viewMode } = useTasks();

  // Create Task Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState('Pending');

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleOpenNewTask = (initialStatus = 'Pending') => {
    setDefaultStatusForNew(initialStatus);
    setIsFormModalOpen(true);
  };

  return (
    <div className="real-app-shell">
      {/* Real-world Collapsible Left Sidebar */}
      <Sidebar
        onOpenNewTask={() => handleOpenNewTask('Pending')}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Canvas Area */}
      <div className="main-canvas">
        {/* Top Breadcrumbs & Search Command Bar */}
        <Navbar
          onOpenNewTask={() => handleOpenNewTask('Pending')}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Project Header Banner & Filters */}
        <ProjectHero />

        {/* View Content: Kanban Board vs Table List */}
        <main style={{ flex: 1 }}>
          {viewMode === 'kanban' ? <TaskKanban /> : <TaskList />}
        </main>
      </div>

      {/* Slide-over Task Detail Drawer (Linear / Asana Style) */}
      <TaskDetailDrawer />

      {/* Full Task Create Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        defaultStatus={defaultStatusForNew}
      />

      {/* Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
