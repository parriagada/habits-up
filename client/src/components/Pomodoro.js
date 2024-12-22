import React, { useState, useEffect, useRef } from 'react';
import './Pomodoro.css';

function Pomodoro() {
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [objetivo, setObjetivo] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [currentSession, setCurrentSession] = useState(1);
    const [pomodoro, setPomodoro] = useState(null);
    const intervalRef = useRef(null);
    const [bonsaiFrame, setBonsaiFrame] = useState(0);
    const [pomodoroCompleted, setPomodoroCompleted] = useState(false);
    const [historialPomodoros, setHistorialPomodoros] = useState([]);

    const presets = {
        "Test": { duracionPomodoro: 5, cantidadDescansos: 1, duracionDescansoTotal: 1 },
        "Corto (15 min)": { duracionPomodoro: 12, cantidadDescansos: 1, duracionDescansoTotal: 3 },
        "Estándar (25 min)": { duracionPomodoro: 20, cantidadDescansos: 1, duracionDescansoTotal: 5 },
        "Largo (50 min)": { duracionPomodoro: 40, cantidadDescansos: 2, duracionDescansoTotal: 5 },
        "Extendido (75 min)": { duracionPomodoro: 60, cantidadDescansos: 3, duracionDescansoTotal: 5 },
        "Maratón (90 min)": { duracionPomodoro: 72, cantidadDescansos: 3, duracionDescansoTotal: 6 },
        "Ultra (120 min)": { duracionPomodoro: 96, cantidadDescansos: 3, duracionDescansoTotal: 8 },
    };

    useEffect(() => {
        if (!isRunning || !selectedPreset) return () => clearInterval(intervalRef.current);

        const tick = () => {
            setRemainingTime(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(intervalRef.current);
                    if (!isBreak) {
                        if (currentSession < selectedPreset.cantidadDescansos) {
                            setIsBreak(true);
                            setRemainingTime((selectedPreset.duracionDescansoTotal / selectedPreset.cantidadDescansos) * 60);
                        } else {
                            finalizarPomodoro();
                        }
                    } else {
                        if (currentSession < selectedPreset.cantidadDescansos) {
                            setCurrentSession(prevSession => prevSession + 1);
                            setIsBreak(false);
                            setRemainingTime(selectedPreset.duracionPomodoro * 60);
                            setIsRunning(true);
                        } else {
                            finalizarPomodoro();
                        }
                    }
                    return 0;
                }
                return prevTime - 1;
            });
        };

        intervalRef.current = setInterval(tick, 1000);

        return () => clearInterval(intervalRef.current);
    }, [isRunning, isBreak, selectedPreset, currentSession]);

    const fetchHistorialPomodoros = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:5000/pomodoros/historial", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const formattedData = data.map(pomodoro => ({
                    ...pomodoro,
                    createdAt: new Date(pomodoro.createdAt),
                }));
                setHistorialPomodoros(formattedData);
            } else {
                const errorText = await response.text();
                console.error("Error fetching history:", response.status, errorText);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    useEffect(() => {
        fetchHistorialPomodoros();
    }, []);

    const iniciarPomodoro = async () => {
        if (!selectedPreset) {
            alert("Por favor, selecciona un preset.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:5000/pomodoros", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...selectedPreset, objetivo }),
            });

            if (response.ok) {
                const nuevoPomodoro = await response.json();
                setPomodoro(nuevoPomodoro);
                setIsBreak(false);
                setCurrentSession(1);
                setRemainingTime(selectedPreset.duracionPomodoro * 60);
                setIsRunning(true);
                setBonsaiFrame(0);
                setPomodoroCompleted(false);
            } else {
                const errorText = await response.text();
                console.error("Error del servidor:", response.status, errorText);
                alert(`Error al iniciar el pomodoro: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Ocurrió un error en la petición al servidor.");
        }
    };

    const pausarPomodoro = () => setIsRunning(false);

    const reanudarPomodoro = () => setIsRunning(true);

    const cancelarPomodoro = async () => {
        setIsRunning(false);
        try {
            const token = localStorage.getItem("token");
            if (!token || !pomodoro) return;
            const response = await fetch(`http://localhost:5000/pomodoros/${pomodoro._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ estado: "cancelado", tiempoTranscurrido: (selectedPreset.duracionPomodoro * 60) - remainingTime }),
            });
            if (response.ok) {
                setPomodoro(null);
                setRemainingTime(0);
                setIsBreak(false);
                setCurrentSession(1);
                setSelectedPreset(null);
                setBonsaiFrame(0);
                setPomodoroCompleted(false);
            } else {
                const errorText = await response.text();
                console.error("Error del servidor:", response.status, errorText);
                alert(`Error al cancelar el pomodoro: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error("Error al cancelar el pomodoro:", error);
            alert("Ocurrió un error al cancelar el pomodoro.");
        }
    };

    const finalizarPomodoro = async () => {
        setIsRunning(false);
        try {
            const token = localStorage.getItem("token");
            if (!token || !pomodoro) return;
            const response = await fetch(`http://localhost:5000/pomodoros/${pomodoro._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ estado: "completado", tiempoTranscurrido: selectedPreset.duracionPomodoro * 60 }),
            });
            if (response.ok) {
                setPomodoro(null);
                setRemainingTime(0);
                setIsBreak(false);
                setCurrentSession(1);
                setSelectedPreset(null);
                setBonsaiFrame(0);
                setPomodoroCompleted(true);
            } else {
                const errorText = await response.text();
                console.error("Error del servidor:", response.status, errorText);
                alert(`Error al finalizar el pomodoro: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error("Error al finalizar el pomodoro:", error);
            alert("Ocurrió un error al finalizar el pomodoro.");
        }
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const calcularIndiceBonsai = () => {
        if (!isRunning || !selectedPreset || isBreak) return 0;
        const duracionPomodoroEnSegundos = selectedPreset.duracionPomodoro * 60;
        const tiempoTranscurrido = duracionPomodoroEnSegundos - remainingTime;
        const numFrames = 11;
        const duracionPorFrame = duracionPomodoroEnSegundos / numFrames;
        let frameActual = Math.floor(tiempoTranscurrido / duracionPorFrame);
        return Math.min(numFrames - 1, frameActual);
    };

    return (
        <div className="pomodoro-container">
            <h2 style={{ textAlign: 'center' }}>Pomodoro</h2>

            {pomodoroCompleted && (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <h3>¡Pomodoro Completado!</h3>
                    <p>Selecciona un nuevo preset para comenzar.</p>
                </div>
            )}

            {!pomodoro && !pomodoroCompleted && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <label htmlFor="presetSelect" style={{ textAlign: 'center' }}>Selecciona un preset:</label>
                    <select
                        id="presetSelect"
                        value={selectedPreset ? Object.keys(presets).find(key => presets[key] === selectedPreset) : ""}
                        onChange={(e) => setSelectedPreset(presets[e.target.value])}
                        style={{ width: '80%', padding: '10px', margin: '10px 0' }}
                    >
                        <option value="">Seleccionar</option>
                        {Object.keys(presets).map((presetName) => (
                            <option key={presetName} value={presetName}>{presetName}</option>
                        ))}
                    </select>
                    {selectedPreset && (
                        <div style={{ textAlign: 'center' }}>
                            <p>Duración del Pomodoro: {selectedPreset.duracionPomodoro} minutos</p>
                            <p>Cantidad de Descansos: {selectedPreset.cantidadDescansos}</p>
                            <p>Duración Total del Descanso: {selectedPreset.duracionDescansoTotal} minutos</p>
                            <label htmlFor="objetivo">Objetivo:</label>
                            <input
                                type="text"
                                id="objetivo"
                                value={objetivo}
                                onChange={(e) => setObjetivo(e.target.value)}
                                style={{ width: '80%', padding: '10px', margin: '10px 0' }}
                            />
                        </div>
                    )}
                    <button onClick={iniciarPomodoro} disabled={!selectedPreset} style={{ width: 'auto', margin: '10px' }}>Iniciar Pomodoro</button>
                </div>
            )}

            {pomodoro && selectedPreset && !pomodoroCompleted && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>Objetivo: {pomodoro.objetivo}</p>
                    <p>Estado: {isBreak ? "Descanso" : "Trabajo"}</p>
                    <p>Tiempo {isBreak ? "de Descanso" : "Restante"}: {formatTime(remainingTime)}</p>
                    <div className="imagen-pomodoro" style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
                        <div
                            className="bonsai-spritesheet"
                            style={{
                                backgroundPositionX: `calc(${calcularIndiceBonsai() * -160}px * var(--pixel-size))`
                            }}
                            alt="Progreso Pomodoro"
                        ></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                        {!isRunning ? (
                            <button onClick={reanudarPomodoro} style={{ margin: '0 5px' }}>Reanudar</button>
                        ) : (
                            <button onClick={pausarPomodoro} style={{ margin: '0 5px' }}>Pausar</button>
                        )}
                        <button onClick={cancelarPomodoro} style={{ margin: '0 5px' }}>Cancelar</button>
                    </div>
                </div>
            )}

            <h2 style={{ marginTop: '30px' }}>Historial de Pomodoros</h2>
            <div className="historial-container">
                {historialPomodoros.map((pomodoro) => (
                    <div key={pomodoro._id} className="historial-item">
                        <div className="historial-row">
                            <span className="historial-label">Objetivo:</span>
                            <span className="historial-value">{pomodoro.objetivo || 'sin objetivo'}</span>
                        </div>
                        <div className="historial-row">
                            <span className="historial-label">Estado:</span>
                            <span className="historial-value">{pomodoro.estado}</span>
                        </div>
                        <div className="historial-row">
                            <span className="historial-label">Duración:</span>
                            <span className="historial-value">{pomodoro.duracionPomodoro} minutos</span>
                        </div>
                        <div className="historial-row">
                            <span className="historial-label">Fecha:</span>
                            <span className="historial-value">
                                {pomodoro.createdAt instanceof Date ? pomodoro.createdAt.toLocaleDateString() : 'Invalid Date'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pomodoro;