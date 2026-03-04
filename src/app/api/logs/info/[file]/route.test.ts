import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { getDB } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  getDB: vi.fn(),
}));

describe("GET /api/logs/info/:file", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return log info for a valid file", async () => {
    const mockRows = [
      {
        file: "access.log",
        table_name: "logs_access",
        status: "READY",
        created_at: new Date("2023-01-01"),
      },
    ];

    const mockRun = vi.fn().mockResolvedValue({
      getRows: () => mockRows,
    });
    const mockConnect = vi.fn().mockResolvedValue({
      run: mockRun,
      close: vi.fn(),
    });
    const mockDB = {
      connect: mockConnect,
    };

    vi.mocked(getDB).mockResolvedValue(mockDB as any);

    const params = Promise.resolve({ file: "access.log" });
    const response = await GET(new Request("http://localhost"), { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.info).toEqual({
      file: "access.log",
      table_name: "logs_access",
      status: "READY",
      created_at: expect.any(String),
    });
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining("WHERE file = 'access.log'"),
    );
  });

  it("should return null if file not found", async () => {
    const mockRun = vi.fn().mockResolvedValue({
      getRows: () => [],
    });
    const mockConnect = vi.fn().mockResolvedValue({
      run: mockRun,
      close: vi.fn(),
    });
    const mockDB = {
      connect: mockConnect,
    };

    vi.mocked(getDB).mockResolvedValue(mockDB as any);

    const params = Promise.resolve({ file: "nonexistent.log" });
    const response = await GET(new Request("http://localhost"), { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.info).toBeNull();
  });

  it("should handle error during fetch", async () => {
    vi.mocked(getDB).mockRejectedValue(new Error("DB Connection Error"));

    const params = Promise.resolve({ file: "access.log" });
    const response = await GET(new Request("http://localhost"), { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch log info");
  });
});
