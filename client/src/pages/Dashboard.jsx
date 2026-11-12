import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import BrowserHeader from '../components/BrowserHeader';
import ProjectHero from '../components/ProjectHero';
import TaskKanban from '../components/TaskKanban';
import TaskList from '../components/TaskList';
import AnalyticsView from '../components/AnalyticsView';
import TaskDetailDrawer from '../components/TaskDetailDrawer';
import TaskFormModal from '../components/TaskFormModal';
import ToastContainer from '../components/ToastContainer';

const Dashboard = () => {
  const { activeBrowserTab, viewMode } = useTasks();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState('Pending');

  const handleOpenNewTask = (initialStatus = 'Pending') => {
    setDefaultStatusForNew(initialStatus);
    setIsFormModalOpen(true);
  };

  return (
    <div className="official-browser-frame">
      {/* 1. Official Browser Shell Header (Window Controls, Tabs, Omnibox, Bookmarks) */}
      <BrowserHeader onOpenNewTask={() => handleOpenNewTask('Pending')} />

      {/* 2. Official Browser Viewport Web Content Area */}
      <div className="browser-viewport-content">
        {activeBrowserTab === 'analytics' ? (
          <AnalyticsView />
        ) : (
          <>
            {/* Project Overview Banner & View Controls */}
            <ProjectHero />

            {/* Main Interactive Work Area: Board vs Table */}
            <main className="browser-main-workspace">
              {viewMode === 'kanban' ? <TaskKanban /> : <TaskList />}
            </main>
          </>
        )}
      </div>

      {/* Slide-over Task Detail Drawer */}
      <TaskDetailDrawer />

      {/* Full Task Create / Edit Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        defaultStatus={defaultStatusForNew}
      />

      {/* Real-time Stackable Toasts */}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
