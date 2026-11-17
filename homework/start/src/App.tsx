import { useState } from "react"
import {
    createTask,
    Filter,
    openCount,
    renameTask,
    seedTasks,
    Task,
    visibleTasks,
    isBlankTitle, // Добавили импорт проверки
} from "./tasks"

const FILTERS: Array<{ id: Filter; label: string }> = [
    { id: "all", label: "Все" },
    { id: "open", label: "Открытые" },
    { id: "done", label: "Готовые" },
]

export function App() {
    const [tasks, setTasks] = useState<Task[]>(seedTasks)
    const [filter, setFilter] = useState<Filter>("all")
    const [draft, setDraft] = useState("")
    const [error, setError] = useState<string | null>(null) // Состояние для ошибки

    function add() {
        // Проверяем на пустоту перед созданием
        if (isBlankTitle(draft)) {
            setError("Название не может быть пустым")
            return // Выходим, чтобы не очищать инпут
        }
        
        const next = createTask(tasks.length + 1, draft)
        if (next !== undefined) {
            setTasks([...tasks, next])
            setError(null) // Сбрасываем ошибку при успехе
            setDraft("")
        } else {
            setError("Название не может быть пустым")
        }
    }

    function rename(task: Task) {
        const title = window.prompt("Название", task.title)
        if (title == null) return
        
        // Проверяем на пустоту перед переименованием
        if (isBlankTitle(title)) {
            setError("Название не может быть пустым")
            return
        }
        
        setTasks(renameTask(tasks, task.id, title))
        setError(null) // Сбрасываем ошибку при успехе
    }

    const shown = visibleTasks(tasks, filter)

    return (
        <div style={{ fontFamily: "system-ui", maxWidth: 640, margin: "40px auto", padding: 16 }}>
            <h1 style={{ margin: "0 0 4px" }}>Мои задачи</h1>
            <p style={{ margin: "0 0 16px", color: "#555" }}>
                Открытых: {openCount(tasks)}
            </p>

            {/* Вывод ошибки на экран */}
            {error && (
                <div style={{ color: "red", marginBottom: 12, fontWeight: "bold" }}>
                    {error}
                </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        style={{ fontWeight: filter === f.id ? 700 : 400 }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {shown.map((task) => (
                    <li
                        key={task.id}
                        style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid #eee" }}
                    >
                        <span style={{ flex: 1, textDecoration: task.done ? "line-through" : "none" }}>
                            {task.title}
                        </span>
                        <button onClick={() => rename(task)}>Переименовать</button>
                    </li>
                ))}
            </ul>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <input
                    value={draft}
                    onChange={(e) => {
                        setDraft(e.target.value)
                        if (error) setError(null) // Убираем ошибку при вводе
                    }}
                    placeholder="Новая задача"
                    style={{ flex: 1, padding: 8 }}
                />
                <button onClick={add}>Добавить</button>
            </div>
        </div>
    )
}