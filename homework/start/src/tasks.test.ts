// не знал до этого формата ts, пришлось разбираться и оставлять комментарии 
import { describe, expect, it } from "vitest"
// Добавление renameTask и openCount в импорты
import { createTask, visibleTasks, seedTasks, renameTask, openCount } from "./tasks"
// поведение, описанное в ISSUE-7.md.
describe("базовая доска", () => {
    it("создаёт задачу и обрезает название", () => {
        const task = createTask(9, "  Купить хлеб  ")
        expect(task?.title).toBe("Купить хлеб")
    })

    it("фильтрует готовые задачи", () => {
        expect(visibleTasks(seedTasks, "done").map((task) => task.id)).toEqual([2])
    })
})
describe("Issue #7: Пустые названия", () => {
  // R1: Проверка создания
  it("R1: не должен создавать задачу из пробелов, табов, NBSP и U+200B", () => {
    expect(createTask(4, "   ")).toBeUndefined();
    expect(createTask(4, "\t")).toBeUndefined();
    expect(createTask(4, "\u00A0")).toBeUndefined();
    //Ловушка. Обычный trim() не удалит этот символ.
    expect(createTask(4, "\u200B")).toBeUndefined(); 
  });

  // R1: Проверка переименования
  it("R1: не должен переименовывать задачу в пустую строку", () => {
    const tasks = [{ id: 1, title: "Старое название", done: false }];
    
    // Пытаемся переименовать в пробелы
    const result1 = renameTask(tasks, 1, "   ");
    expect(result1[0].title).toBe("Старое название"); // Название не должно измениться

    // Пытаемся переименовать в U+200B
    const result2 = renameTask(tasks, 1, "\u200B");
    expect(result2[0].title).toBe("Старое название"); // Название не должно измениться
  });

  // R2: Проверка фильтрации списка
  it("R2: унаследованная пустая задача не должна быть в списке 'Открытые'", () => {
    const open = visibleTasks(seedTasks, "open");
    
    // В seedTasks есть 1 нормальная задача и 1 пустая (id: 3).
    // Значит, в списке открытых должна остаться только 1.
    expect(open.length).toBe(1);
    expect(open.find(t => t.id === 3)).toBeUndefined();
  });

  // R3: Проверка счетчика
  it("R3: счетчик 'Открытых' не должен считать пустую задачу", () => {
    // В seedTasks сейчас 2 открытые задачи (одна нормальная, одна пустая).
    // Счетчик должен показывать 1.
    expect(openCount(seedTasks)).toBe(1);
  });
});