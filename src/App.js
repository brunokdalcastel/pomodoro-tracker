import React, { useState, useEffect } from 'react';
import './App.css';

const APP_PREFIX = 'pomodoro-tracker-';

function App() {
  const [pomoDuration, setPomoDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(pomoDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomo');

  const [subjects, setSubjects] = useState([]);
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState("");

  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem(APP_PREFIX + 'subjects');
      if (savedSubjects) {
        const parsedSubjects = JSON.parse(savedSubjects);
        setSubjects(parsedSubjects);
        if (parsedSubjects.length > 0 && currentSubjectId === null) {
          setCurrentSubjectId(parsedSubjects[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load subjects from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(APP_PREFIX + 'subjects', JSON.stringify(subjects));
    } catch (error) {
      console.error("Failed to save subjects to localStorage", error);
    }
  }, [subjects]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      if (mode === 'pomo' && currentSubjectId) {
        const timeSpent = pomoDuration * 60;
        setSubjects(prevSubjects =>
          prevSubjects.map(s =>
            s.id === currentSubjectId ? { ...s, time: s.time + timeSpent } : s
          )
        );
      }

      const newMode = mode === 'pomo' ? 'break' : 'pomo';
      const newTime = (newMode === 'pomo' ? pomoDuration : breakDuration) * 60;
      setMode(newMode);
      setTimeRemaining(newTime);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  useEffect(() => {
      if (!isActive) {
          setTimeRemaining((mode === 'pomo' ? pomoDuration : breakDuration) * 60);
      }
  }, [pomoDuration, breakDuration, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePomoDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10);
    if (!isNaN(newDuration) && newDuration > 0) {
      setPomoDuration(newDuration);
    }
  };

  const handleBreakDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10);
    if (!isNaN(newDuration) && newDuration > 0) {
      setBreakDuration(newDuration);
    }
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubjectName.trim() !== "" && !subjects.find(s => s.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
      const newSubject = { id: Date.now(), name: newSubjectName.trim(), time: 0 };
      setSubjects([...subjects, newSubject]);
      setNewSubjectName("");
      if (currentSubjectId === null) {
        setCurrentSubjectId(newSubject.id);
      }
    }
  };

  const toggleTimer = () => {
    if (subjects.length === 0 && mode === 'pomo') {
      alert("Por favor, adicione e selecione uma matéria antes de iniciar um ciclo de foco.");
      return;
    }
    if (currentSubjectId === null && mode === 'pomo') {
        alert("Por favor, selecione uma matéria antes de iniciar.");
        return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('pomo');
    setTimeRemaining(pomoDuration * 60);
  };

  return (
    <div className="App container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1 className="text-center mb-4">{mode === 'pomo' ? 'Hora de Focar!' : 'Hora da Pausa!'}</h1>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Configurações</h5>
              <div className="row">
                <div className="col">
                  <label htmlFor="pomo-duration" className="form-label">Duração do Foco (minutos)</label>
                  <input 
                    type="number" 
                    id="pomo-duration" 
                    className="form-control" 
                    value={pomoDuration}
                    onChange={handlePomoDurationChange}
                    disabled={isActive}
                  />
                </div>
                <div className="col">
                  <label htmlFor="break-duration" className="form-label">Duração do Intervalo (minutos)</label>
                  <input 
                    type="number" 
                    id="break-duration" 
                    className="form-control" 
                    value={breakDuration}
                    onChange={handleBreakDurationChange}
                    disabled={isActive}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body text-center">
                <div className="mb-3 w-75 mx-auto">
                    <label htmlFor="subject-select" className="form-label">Matéria da Sessão</label>
                    <select 
                    id="subject-select" 
                    className="form-select"
                    value={currentSubjectId || ''}
                    onChange={e => setCurrentSubjectId(e.target.value ? parseInt(e.target.value, 10) : null)}
                    disabled={isActive || subjects.length === 0}
                    >
                    <option value="">-- Selecione uma matéria --</option>
                    {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    </select>
                </div>

              <h2 className="display-1">{formatTime(timeRemaining)}</h2>
              <div className="btn-group" role="group">
                <button className="btn btn-primary px-4 py-2" onClick={toggleTimer} disabled={currentSubjectId === null && mode === 'pomo'}>
                  {isActive ? 'Pausar' : 'Iniciar'}
                </button>
                <button className="btn btn-secondary px-4 py-2" onClick={resetTimer}>
                  Resetar
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gerenciar Matérias</h5>
              <form onSubmit={handleAddSubject} className="input-group mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nome da nova matéria"
                  value={newSubjectName}
                  onChange={e => setNewSubjectName(e.target.value)}
                />
                <button className="btn btn-outline-primary" type="submit">Adicionar</button>
              </form>

              <ul className="list-group">
                {subjects.length > 0 ? subjects.map(s => (
                  <li key={s.id} className={`list-group-item d-flex justify-content-between align-items-center ${s.id === currentSubjectId ? 'active' : ''}`}>
                    {s.name}
                    <span className="badge bg-dark rounded-pill">
                      {Math.floor(s.time / 60)} min
                    </span>
                  </li>
                )) : <li className="list-group-item">Nenhuma matéria adicionada ainda.</li>}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
