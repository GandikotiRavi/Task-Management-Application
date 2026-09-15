import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Search, X, Kanban, ListFilter } from 'lucide-react';

const TaskControls = () => {
  const {
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    changeViewMode
  } = useTasks();

  const statusOptions = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="controls-bar" aria-label="Task Filters and View Controls">
      {/* Search Input */}
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, description, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="task-search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="action-icon-btn"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-group">
        {/* Status Filter Pills */}
        <div className="status-pills" role="tablist" aria-label="Filter by Status">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`pill-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
              role="tab"
              aria-selected={filterStatus === status}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <select
          className="select-control"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          aria-label="Filter by Priority"
          id="priority-filter-select"
        >
          <option value="All">All Priorities</option>
          <option value="Urgent">🔥 Urgent</option>
          <option value="High">⚡ High</option>
          <option value="Medium">🔷 Medium</option>
          <option value="Low">☕ Low</option>
        </select>

        {/* Sort By */}
        <select
          className="select-control"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort Tasks"
          id="sort-by-select"
        >
          <option value="createdAt_desc">Sort: Newest</option>
          <option value="createdAt_asc">Sort: Oldest</option>
          <option value="dueDate_asc">Sort: Due Date (Earliest)</option>
          <option value="dueDate_desc">Sort: Due Date (Latest)</option>
          <option value="priority_desc">Sort: Highest Priority</option>
          <option value="title_asc">Sort: Title (A-Z)</option>
        </select>

        {/* View Switcher (Kanban vs List) */}
        <div className="view-toggle" role="group" aria-label="Layout View Switcher">
          <button
            onClick={() => changeViewMode('kanban')}
            className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            title="Kanban Board View"
            aria-label="Kanban Board View"
          >
            <Kanban size={18} />
          </button>
          <button
            onClick={() => changeViewMode('list')}
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            title="Table List View"
            aria-label="Table List View"
          >
            <ListFilter size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskControls;
