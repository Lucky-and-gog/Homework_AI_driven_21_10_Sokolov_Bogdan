export type Filter = "all" | "open" | "done"

export interface Task {
    id: number
    title: string
    done: boolean
}

/**
 * Доска в том виде, в каком она приходит из хранилища. Строку 3 сохранила старая
 * форма ещё до issue #7: это название из одних пробелов, и оно всё ещё здесь.
 */
export const seedTasks: Task[] = [
    { id: 1, title: "Сдать лабораторную", done: false },
    { id: 2, title: "Купить продукты", done: true },
    { id: 3, title: "   ", done: false },
]

/** Доска считает название без непробельных символов отсутствующим названием. */
export function isBlankTitle(title: string): boolean {
    // Убираем U+200B и проверяем на пустоту через trim
    const cleaned = title.replace(/\u200B/g, "")
    return cleaned.trim().length === 0
}

/**
 * Создание задачи. Проверяем на пустоту, включая невидимые символы.
 */
export function createTask(id: number, title: string): Task | undefined {
    if (isBlankTitle(title)) return undefined
    // Очищаем от невидимых символов и обрезаем пробелы
    const safeTitle = title.replace(/\u200B/g, "").trim()
    return { id, title: safeTitle, done: false }
}

/** Переименование существующей задачи. Добавлена проверка по Issue #7. */
export function renameTask(tasks: Task[], id: number, title: string): Task[] {
    // Если название пустое, возвращаем доску без изменений (задача не переименовывается)
    if (isBlankTitle(title)) {
        return tasks
    }
    const safeTitle = title.replace(/\u200B/g, "").trim()
    return tasks.map((task) => (task.id === id ? { ...task, title: safeTitle } : task))
}

export function visibleTasks(tasks: Task[], filter: Filter): Task[] {
    // R2: Отфильтровываем все пустые задачи, включая унаследованные
    const validTasks = tasks.filter(task => !isBlankTitle(task.title))
    
    if (filter === "open") return validTasks.filter((task) => !task.done)
    if (filter === "done") return validTasks.filter((task) => task.done)
    return validTasks
}

/**
 * Счётчик в шапке. R3: Игнорируем пустые задачи при подсчете.
 */
export function openCount(tasks: Task[]): number {
    return tasks.filter((task) => !task.done && !isBlankTitle(task.title)).length
}