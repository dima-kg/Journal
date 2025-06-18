import React, { useState } from 'react';
import { Plus, BookOpen, BarChart3, LogOut, User, Settings, MapPin, Tag, FileText } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useJournalEntries } from './hooks/useJournalEntries';
import AuthForm from './components/AuthForm';
import JournalFilters from './components/JournalFilters';
import JournalEntry from './components/JournalEntry';
import AddEntryForm from './components/AddEntryForm';
import EquipmentManager from './components/EquipmentManager';
import LocationManager from './components/LocationManager';
import CategoryManager from './components/CategoryManager';
import ReportModal from './components/ReportModal';

function App() {
  const { user, loading: authLoading, signOut, getUserDisplayName } = useAuth();
  const { entries, loading, filters, setFilters, addEntry, cancelEntry } = useJournalEntries();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEquipmentManager, setShowEquipmentManager] = useState(false);
  const [showLocationManager, setShowLocationManager] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Показываем загрузку пока проверяется аутентификация
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Показываем форму аутентификации если пользователь не авторизован
  if (!user) {
    return <AuthForm />;
  }

  const handleAddEntry = async (entryData: Parameters<typeof addEntry>[0]) => {
    await addEntry(entryData);
    setShowAddForm(false);
  };

  const handleCancelEntry = async (id: string, reason: string, cancelledBy: string) => {
    await cancelEntry(id, reason, cancelledBy);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatsData = () => {
    const total = entries.length;
    const active = entries.filter(e => e.status === 'active').length;
    const drafts = entries.filter(e => e.status === 'draft').length;
    const cancelled = entries.filter(e => e.status === 'cancelled').length;
    const critical = entries.filter(e => e.priority === 'critical' && e.status === 'active').length;

    return { total, active, drafts, cancelled, critical };
  };

  const stats = getStatsData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка журнала...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Оперативный журнал</h1>
                <p className="text-sm text-gray-600">Ведение записей о событиях во время смены</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Информация о пользователе */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{getUserDisplayName()}</span>
              </div>

              {/* Управление справочниками */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCategoryManager(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors"
                  title="Управление категориями"
                >
                  <Tag className="w-5 h-5" />
                  <span className="hidden sm:inline">Категории</span>
                </button>
                
                <button
                  onClick={() => setShowEquipmentManager(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title="Управление оборудованием"
                >
                  <Settings className="w-5 h-5" />
                  <span className="hidden sm:inline">Оборудование</span>
                </button>
                
                <button
                  onClick={() => setShowLocationManager(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-green-600 transition-colors"
                  title="Управление местоположениями"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="hidden sm:inline">Местоположения</span>
                </button>
              </div>

              {/* Кнопка отчетов */}
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Сформировать отчет"
              >
                <FileText className="w-5 h-5" />
                <span className="hidden sm:inline">Отчеты</span>
              </button>
              
              {/* Кнопка добавления записи */}
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Новая запись</span>
              </button>
              
              {/* Кнопка выхода */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Всего записей</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-gray-600">Активные</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.drafts}</p>
                <p className="text-sm text-gray-600">Черновики</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                <p className="text-sm text-gray-600">Отмененные</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.critical}</p>
                <p className="text-sm text-gray-600">Критические</p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <JournalFilters filters={filters} onFiltersChange={setFilters} />

        {/* Список записей */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Записи не найдены</h3>
              <p className="text-gray-600 mb-4">
                {Object.keys(filters).length > 0 
                  ? "Попробуйте изменить параметры фильтрации"
                  : "Создайте первую запись в оперативном журнале"
                }
              </p>
              {Object.keys(filters).length === 0 && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Создать запись
                </button>
              )}
            </div>
          ) : (
            entries.map(entry => (
              <JournalEntry
                key={entry.id}
                entry={entry}
                onCancel={handleCancelEntry}
              />
            ))
          )}
        </div>
      </main>

      {/* Модальные окна */}
      {showAddForm && (
        <AddEntryForm
          onSubmit={handleAddEntry}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {showEquipmentManager && (
        <EquipmentManager
          onClose={() => setShowEquipmentManager(false)}
        />
      )}

      {showLocationManager && (
        <LocationManager
          onClose={() => setShowLocationManager(false)}
        />
      )}

      {showReportModal && (
        <ReportModal
          entries={entries}
          filters={filters}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

export default App;
