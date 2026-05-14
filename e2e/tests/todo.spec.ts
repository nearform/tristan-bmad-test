import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const apiUrl = process.env.E2E_API_URL ?? "http://127.0.0.1:4000";

async function resetTodos(request: import("@playwright/test").APIRequestContext) {
  const list = await request.get(`${apiUrl}/todos`);
  const body = (await list.json()) as { todos: { id: string }[] };
  for (const t of body.todos) {
    await request.delete(`${apiUrl}/todos/${t.id}`);
  }
}

test.beforeEach(async ({ request }) => {
  await resetTodos(request);
});

test("shows empty state when there are no todos", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/No todos yet/i)).toBeVisible();
});

test("creates a todo", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/What needs doing/i).fill("Learn BMAD");
  await page.getByRole("button", { name: /^Add$/i }).click();
  await expect(page.getByText("Learn BMAD")).toBeVisible();
});

test("marks a todo complete", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/What needs doing/i).fill("Task A");
  await page.getByRole("button", { name: /^Add$/i }).click();
  const checkbox = page.getByRole("checkbox", { name: /Mark "Task A" complete/i });
  await checkbox.click();
  await expect(checkbox).toBeChecked();
});

test("deletes a todo", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/What needs doing/i).fill("Remove me");
  await page.getByRole("button", { name: /^Add$/i }).click();
  await page.getByRole("button", { name: /Delete Remove me/i }).click();
  await expect(page.getByText(/No todos yet/i)).toBeVisible();
});

test("shows error state when list fetch fails", async ({ page }) => {
  await page.route("**/todos", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ status: 500, body: "error" });
      return;
    }
    await route.continue();
  });
  await page.goto("/");
  await expect(page.getByText(/Could not load todos/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Retry/i })).toBeVisible();
});

test("home page has no critical axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});
