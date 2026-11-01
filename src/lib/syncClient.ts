/**
 * Triple-Tier Sync Client for Better Than Yesterday
 * Tier 1: Google Apps Script Web App (Google Sheets Cloud Database)
 * Tier 2: Java Spring Boot Backend (http://localhost:8080/api)
 * Tier 3: Next.js API / LocalStorage Offline Fallback
 */

export interface SyncPayload {
  action: string;
  user?: string;
  [key: string]: any;
}

const JAVA_BACKEND_URL = process.env.NEXT_PUBLIC_JAVA_BACKEND_URL || 'http://localhost:8080';
const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_SHEET_API_URL || '';

export class SyncClient {
  
  static getActiveUser(): string {
    if (typeof window === 'undefined') return 'xu4ns0n';
    try {
      const uRaw = localStorage.getItem('bty_current_user');
      if (uRaw) {
        const u = JSON.parse(uRaw);
        return u.username || 'xu4ns0n';
      }
    } catch {}
    return 'xu4ns0n';
  }

  // Fetch full data bundle (Habits, Logs, Finance Jars, Transactions)
  static async fetchAllData(user?: string) {
    const targetUser = user || this.getActiveUser();

    // 1. Try Google Sheets Web App if configured
    if (GOOGLE_SHEET_URL) {
      try {
        const res = await fetch(`${GOOGLE_SHEET_URL}?action=all&user=${encodeURIComponent(targetUser)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        const data = await res.json();
        if (data.success) {
          console.log('✅ Synchronized from Google Sheets Web App');
          return data;
        }
      } catch (err) {
        console.warn('⚠️ Google Sheets sync unreachable, falling back to Java / Local:', err);
      }
    }

    // 2. Try Java Spring Boot Backend
    try {
      const [habitsRes, logsRes, incomeRes, jarsRes] = await Promise.all([
        fetch(`${JAVA_BACKEND_URL}/api/habits`, { cache: 'no-store' }),
        fetch(`${JAVA_BACKEND_URL}/api/logs`, { cache: 'no-store' }),
        fetch(`${JAVA_BACKEND_URL}/api/finance/income`, { cache: 'no-store' }),
        fetch(`${JAVA_BACKEND_URL}/api/finance/jars`, { cache: 'no-store' }),
      ]);

      if (habitsRes.ok && logsRes.ok) {
        const habitsData = await habitsRes.json();
        const logsData = await logsRes.json();
        const incomeData = incomeRes.ok ? await incomeRes.json() : null;
        const jarsData = jarsRes.ok ? await jarsRes.json() : null;

        console.log('✅ Synchronized from Java Spring Boot Backend (Port 8080)');
        return {
          success: true,
          habits: habitsData.habits,
          completedHabitIds: logsData.completedHabitIds,
          streakCount: logsData.streakCount,
          savedToday: logsData.savedToday,
          savedTotal: logsData.savedTotal,
          completedDatesMap: logsData.completedDatesMap,
          income: incomeData?.data,
          jars: jarsData?.data,
        };
      }
    } catch (err) {
      // Backend not running, proceed to fallback
    }

    return null;
  }

  // Post action event (Toggle log, add habit, transaction)
  static async postAction(payload: SyncPayload) {
    const targetUser = payload.user || this.getActiveUser();
    const fullPayload = { ...payload, user: targetUser };

    // 1. Send to Google Sheets if configured
    if (GOOGLE_SHEET_URL) {
      try {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors', // standard for GAS web app cross-origin post
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullPayload),
        });
        console.log('📤 Action dispatched to Google Sheets Web App');
      } catch (err) {
        console.warn('Could not post to Google Sheets:', err);
      }
    }

    // 2. Send to Java Spring Boot Backend
    try {
      if (payload.action === 'toggleLog') {
        await fetch(`${JAVA_BACKEND_URL}/api/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else if (payload.action === 'createHabit') {
        await fetch(`${JAVA_BACKEND_URL}/api/habits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else if (payload.action === 'addTransaction') {
        await fetch(`${JAVA_BACKEND_URL}/api/finance/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch {}
  }
}

