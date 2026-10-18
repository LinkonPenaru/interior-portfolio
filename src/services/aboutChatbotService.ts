/**
 * Chatbot Integration & Tool Execution Engine
 * 
 * Exposes formal tools:
 * - getAboutProfile()
 * - updateAboutProfile(partialFields)
 * - addEducation(entry)
 * - updateEducation(id, partialFields)
 * - removeEducation(id)
 * 
 * Manages owner vs visitor permissions, diff staging, explicit confirmation,
 * disambiguation, parameter validation, and audit change logging.
 */

import {
  AboutProfile,
  ChatbotChangeLog,
  EducationEntry,
  SaveProfileResult,
} from '../types/about';
import { aboutService } from './aboutService';

const CHATBOT_AUDIT_LOGS_KEY = 'portfolio_chatbot_audit_logs_v1';

export interface PendingAction {
  id: string;
  tool: 'updateAboutProfile' | 'addEducation' | 'updateEducation' | 'removeEducation';
  description: string;
  diffSummary: string;
  previousValue: unknown;
  payload: unknown;
}

export interface ChatbotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  pendingAction?: PendingAction;
}

export const getChatbotAuditLogs = (): ChatbotChangeLog[] => {
  try {
    const raw = localStorage.getItem(CHATBOT_AUDIT_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const recordAuditLog = (
  tool: string,
  description: string,
  previousValue: unknown,
  newValue: unknown
) => {
  try {
    const logs = getChatbotAuditLogs();
    const newEntry: ChatbotChangeLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      tool,
      description,
      previousValue,
      newValue,
    };
    logs.unshift(newEntry);
    localStorage.setItem(CHATBOT_AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.warn('Failed to record chatbot audit log:', e);
  }
};

export class AboutChatbotEngine {
  private isOwner: boolean;

  constructor(isOwner: boolean) {
    this.isOwner = isOwner;
  }

  setOwnerStatus(isOwner: boolean) {
    this.isOwner = isOwner;
  }

  // ==========================================
  // FORMAL TOOL DEFINITIONS
  // ==========================================

  /**
   * Tool: getAboutProfile()
   * Accessible by both visitors and owner.
   */
  async getAboutProfile(): Promise<AboutProfile> {
    return await aboutService.getProfile();
  }

  /**
   * Tool: updateAboutProfile(partialFields)
   * Owner only. Requires confirmed action.
   */
  async updateAboutProfile(
    partial: Partial<AboutProfile>
  ): Promise<SaveProfileResult> {
    if (!this.isOwner) {
      throw new Error('Permission Denied: Only the verified portfolio owner can update profile information.');
    }

    const current = await this.getAboutProfile();
    const updated: AboutProfile = {
      ...current,
      ...partial,
      location: partial.location
        ? { ...(current.location || { displayText: '', showExactLocation: false }), ...partial.location }
        : current.location,
      version: current.version,
    };

    const res = await aboutService.saveProfile(updated, false);
    if (res.success && res.profile) {
      recordAuditLog('updateAboutProfile', 'Updated profile fields', current, partial);
    }
    return res;
  }

  /**
   * Tool: addEducation(entry)
   * Owner only.
   */
  async addEducation(
    entry: Omit<EducationEntry, 'id'>
  ): Promise<SaveProfileResult> {
    if (!this.isOwner) {
      throw new Error('Permission Denied: Only the verified portfolio owner can add education.');
    }

    const current = await this.getAboutProfile();
    const newEntry: EducationEntry = {
      ...entry,
      id: `edu-${Date.now()}`,
    };

    const updated: AboutProfile = {
      ...current,
      education: [...(current.education || []), newEntry],
      version: current.version,
    };

    const res = await aboutService.saveProfile(updated, false);
    if (res.success && res.profile) {
      recordAuditLog('addEducation', `Added education at ${entry.institution}`, current.education, newEntry);
    }
    return res;
  }

  /**
   * Tool: updateEducation(id, partialFields)
   * Owner only.
   */
  async updateEducation(
    id: string,
    partial: Partial<EducationEntry>
  ): Promise<SaveProfileResult> {
    if (!this.isOwner) {
      throw new Error('Permission Denied: Only the verified portfolio owner can update education.');
    }

    const current = await this.getAboutProfile();
    const existing = (current.education || []).find((e) => e.id === id);
    if (!existing) {
      throw new Error(`Education entry with id "${id}" was not found.`);
    }

    const updatedEducation = (current.education || []).map((e) =>
      e.id === id ? { ...e, ...partial } : e
    );

    const updated: AboutProfile = {
      ...current,
      education: updatedEducation,
      version: current.version,
    };

    const res = await aboutService.saveProfile(updated, false);
    if (res.success && res.profile) {
      recordAuditLog('updateEducation', `Updated education at ${existing.institution}`, existing, partial);
    }
    return res;
  }

  /**
   * Tool: removeEducation(id)
   * Owner only.
   */
  async removeEducation(id: string): Promise<SaveProfileResult> {
    if (!this.isOwner) {
      throw new Error('Permission Denied: Only the verified portfolio owner can remove education.');
    }

    const current = await this.getAboutProfile();
    const existing = (current.education || []).find((e) => e.id === id);
    if (!existing) {
      throw new Error(`Education entry with id "${id}" was not found.`);
    }

    const updatedEducation = (current.education || []).filter((e) => e.id !== id);
    const updated: AboutProfile = {
      ...current,
      education: updatedEducation,
      version: current.version,
    };

    const res = await aboutService.saveProfile(updated, false);
    if (res.success && res.profile) {
      recordAuditLog('removeEducation', `Removed education at ${existing.institution}`, existing, null);
    }
    return res;
  }

  // ==========================================
  // NATURAL LANGUAGE ASSISTANT PROCESSING
  // ==========================================

  /**
   * Processes a natural language chat prompt from the user, determining
   * whether to explain public information, stage a diff for confirmation,
   * ask for missing parameters, or execute an authorized tool.
   */
  async processUserMessage(
    userText: string,
    history: ChatbotMessage[]
  ): Promise<{ responseText: string; pendingAction?: PendingAction }> {
    const text = userText.trim();
    const lower = text.toLowerCase();
    const profile = await this.getAboutProfile();

    // 1. If user is a visitor and tries to modify data
    const isEditIntent =
      lower.includes('update') ||
      lower.includes('change') ||
      lower.includes('add education') ||
      lower.includes('delete') ||
      lower.includes('remove') ||
      lower.includes('set location');

    if (isEditIntent && !this.isOwner) {
      return {
        responseText:
          '🔒 **Owner Authentication Required**\n\n' +
          'You are currently viewing the portfolio in public visitor mode. Only the authenticated portfolio owner can update profile information or add education.\n\n' +
          'If you are the site owner, please log in through the Admin Portal to make live modifications.',
      };
    }

    // 2. Handle Location Updates
    // Example: "Update my location to Dhaka, Bangladesh" or "Change location to Mumbai"
    if (lower.startsWith('update location') || lower.startsWith('change location') || lower.startsWith('set location')) {
      const targetLocation = text.replace(/^(update|change|set)\s+location(\s+to)?/i, '').trim();
      if (!targetLocation) {
        return {
          responseText: 'Please specify the new location (e.g. *"Update location to Dhaka, Bangladesh"*).',
        };
      }

      const prevLoc = profile.location?.displayText || 'None set';
      const proposedLoc = {
        displayText: targetLocation,
        city: targetLocation.split(',')[0]?.trim() || targetLocation,
        country: targetLocation.includes(',') ? targetLocation.split(',')[1]?.trim() : undefined,
        showExactLocation: false,
      };

      return {
        responseText:
          `📍 **Proposed Location Change**\n\n` +
          `• **Current Location:** ${prevLoc}\n` +
          `• **New Location:** ${targetLocation}\n\n` +
          `Would you like to save this update to your About profile?`,
        pendingAction: {
          id: `act-${Date.now()}`,
          tool: 'updateAboutProfile',
          description: `Update location to "${targetLocation}"`,
          diffSummary: `Change location from "${prevLoc}" to "${targetLocation}"`,
          previousValue: profile.location,
          payload: { location: proposedLoc },
        },
      };
    }

    // 3. Handle Headline or Bio updates
    if (lower.startsWith('update headline') || lower.startsWith('change headline')) {
      const newHeadline = text.replace(/^(update|change)\s+headline(\s+to)?/i, '').trim();
      if (!newHeadline) {
        return { responseText: 'Please provide the new headline.' };
      }
      return {
        responseText:
          `✏️ **Proposed Headline Update**\n\n` +
          `• **Previous:** "${profile.headline || 'None'}"\n` +
          `• **New:** "${newHeadline}"\n\n` +
          `Please confirm if you would like to apply this change.`,
        pendingAction: {
          id: `act-${Date.now()}`,
          tool: 'updateAboutProfile',
          description: `Update headline to "${newHeadline}"`,
          diffSummary: `Change headline to "${newHeadline}"`,
          previousValue: profile.headline,
          payload: { headline: newHeadline },
        },
      };
    }

    // 4. Handle "Hide grade" or "Show grade"
    if (lower.includes('hide my grade') || lower.includes('hide grade')) {
      const entries = profile.education || [];
      if (entries.length === 0) {
        return { responseText: 'No education entries were found in your profile.' };
      }

      // Check if user specified which one
      const target = entries[0];
      return {
        responseText:
          `🔒 **Privacy Setting: Hide Grade**\n\n` +
          `• **Target:** ${target.institution} (${target.program || target.level})\n` +
          `• **Action:** Hide grade from public view while preserving recorded data.\n\n` +
          `Confirm to hide this grade publicly?`,
        pendingAction: {
          id: `act-${Date.now()}`,
          tool: 'updateEducation',
          description: `Hide grade for ${target.institution}`,
          diffSummary: `Set showGrade: false for ${target.institution}`,
          previousValue: target.showGrade,
          payload: { id: target.id, partial: { showGrade: false } },
        },
      };
    }

    // 5. Handle Education Add Request
    // Example: "Add education: Bachelor of Architecture at Rachana Sansad, 2024 to present, CGPA 9.2/10"
    if (lower.startsWith('add education') || lower.startsWith('add my education')) {
      const details = text.replace(/^(add\s+education|add\s+my\s+education):?/i, '').trim();

      // Check for minimum required parameters: institution and start year
      if (!details) {
        return {
          responseText:
            '🎓 **Add New Education**\n\n' +
            'Please provide the key details in this format:\n' +
            '*"Add education: [Level] at [Institution], [Start Year]–[End Year or Present], Grade: [Value/Scale]"*\n\n' +
            '**Example:**\n' +
            '*"Add education: University at Rachana Sansad Academy of Architecture, 2024 to present, CGPA 9.2/10.0"*',
        };
      }

      // Simple regex parser for common natural language formats
      const hasUniversity = /university|bachelor|master|b\.?sc|b\.?voc|m\.?sc/i.test(details);
      const hasCollege = /college|hsc|a-level|intermediate/i.test(details);
      const hasSchool = /school|ssc|o-level|secondary/i.test(details);

      const level = hasUniversity ? 'university' : (hasCollege ? 'college' : (hasSchool ? 'school' : 'other'));
      const isOngoing = /present|ongoing|current|now/i.test(details);
      
      const yearsMatch = details.match(/\b(19\d\d|20\d\d)\b/g);
      const startYear = yearsMatch && yearsMatch[0] ? parseInt(yearsMatch[0], 10) : new Date().getFullYear();
      const endYear = (!isOngoing && yearsMatch && yearsMatch[1]) ? parseInt(yearsMatch[1], 10) : undefined;

      // Extract institution
      let institution = details
        .replace(/^(university|college|school)\s+at\s+/i, '')
        .split(/,|\bin\b|\bfrom\b|\bwith\b|\bgrade\b/i)[0]
        ?.trim() || 'Institution Name';

      // Grade parsing
      let gradeSystem: EducationEntry['gradeSystem'] = undefined;
      let gradeValue: string | undefined = undefined;
      let gradeScale: string | undefined = undefined;

      const cgpaMatch = details.match(/c?gpa\s*[:=]?\s*(\d+[\.,]?\d*)\s*(?:\/|\s+out\s+of\s+)?\s*(\d+[\.,]?\d*)?/i);
      if (cgpaMatch) {
        gradeSystem = /cgpa/i.test(cgpaMatch[0]) ? 'cgpa' : 'gpa';
        gradeValue = cgpaMatch[1].replace(',', '.');
        gradeScale = cgpaMatch[2] ? cgpaMatch[2].replace(',', '.') : '4.0';
      }

      const percentMatch = details.match(/(\d+[\.,]?\d*)\s*%/);
      if (percentMatch) {
        gradeSystem = 'percentage';
        gradeValue = percentMatch[1].replace(',', '.');
      }

      const proposedEntry: Omit<EducationEntry, 'id'> = {
        level,
        institution,
        program: 'Interior Architecture & Spatial Design',
        startYear,
        endYear,
        isOngoing,
        gradeSystem,
        gradeValue,
        gradeScale,
        showGrade: true,
      };

      const gradeSummary = gradeValue ? `${gradeSystem?.toUpperCase()} ${gradeValue}${gradeScale ? ` / ${gradeScale}` : ''}` : 'None';
      const yearSummary = isOngoing ? `${startYear} – Present` : `${startYear} – ${endYear || startYear}`;

      return {
        responseText:
          `🎓 **Proposed Education Entry**\n\n` +
          `• **Institution:** ${institution}\n` +
          `• **Level:** ${level.toUpperCase()}\n` +
          `• **Timeline:** ${yearSummary}\n` +
          `• **Grade:** ${gradeSummary}\n\n` +
          `Would you like to add this education entry to your profile?`,
        pendingAction: {
          id: `act-${Date.now()}`,
          tool: 'addEducation',
          description: `Add education: ${institution} (${yearSummary})`,
          diffSummary: `Add ${level} entry for "${institution}" (${yearSummary})`,
          previousValue: null,
          payload: proposedEntry,
        },
      };
    }

    // 6. Handle Education Remove Request
    if (lower.startsWith('remove education') || lower.startsWith('delete education')) {
      const targetQuery = text.replace(/^(remove|delete)\s+education:?/i, '').trim();
      const entries = profile.education || [];

      if (entries.length === 0) {
        return { responseText: 'You currently have no education entries to remove.' };
      }

      let matched = entries.find((e) =>
        e.institution.toLowerCase().includes(targetQuery.toLowerCase()) ||
        e.level.toLowerCase().includes(targetQuery.toLowerCase())
      );

      // If ambiguous or no query given, list existing entries
      if (!matched) {
        const listStr = entries
          .map((e, idx) => `${idx + 1}. **${e.institution}** (${e.level}, ${e.startYear}–${e.isOngoing ? 'Present' : e.endYear})`)
          .join('\n');
        return {
          responseText:
            `Which education entry would you like to remove? Please specify by name:\n\n${listStr}\n\n` +
            `Example: *"Remove education Rachana Sansad"*`,
        };
      }

      return {
        responseText:
          `⚠️ **Confirm Removal of Education**\n\n` +
          `• **Institution:** ${matched.institution}\n` +
          `• **Level:** ${matched.level}\n` +
          `• **Timeline:** ${matched.startYear} – ${matched.isOngoing ? 'Present' : matched.endYear}\n\n` +
          `Are you sure you want to permanently remove this entry?`,
        pendingAction: {
          id: `act-${Date.now()}`,
          tool: 'removeEducation',
          description: `Remove education entry for ${matched.institution}`,
          diffSummary: `Remove education entry: "${matched.institution}"`,
          previousValue: matched,
          payload: { id: matched.id },
        },
      };
    }

    // 7. Standard Knowledge Responses about Urvi and the Portfolio
    if (lower.includes('who are you') || lower.includes('about urvi') || lower.includes('background')) {
      return {
        responseText:
          `**Urvi G Eragola** is an interior architecture and spatial design practitioner studying at **${profile.location?.displayText || 'Rachana Sansad\'s Academy of Architecture, Mumbai'}**.\n\n` +
          `${profile.bio || 'Her practice emphasizes tactile materiality, ergonomic tolerances, and measured architectural hand drafting.'}\n\n` +
          `Current Location: **${profile.location?.displayText || 'Mumbai, India'}**`,
      };
    }

    if (lower.includes('education') || lower.includes('degree') || lower.includes('college') || lower.includes('school')) {
      const entries = aboutService.getSortedEducationForPublic(profile.education);
      if (entries.length === 0) {
        return { responseText: 'No education entries are currently published.' };
      }
      const eduList = entries
        .map((e) => {
          const yrs = e.isOngoing ? `${e.startYear} – Present` : `${e.startYear} – ${e.endYear || e.startYear}`;
          const gradeStr = e.showGrade && e.gradeValue ? ` • Grade: ${e.gradeValue}${e.gradeScale ? `/${e.gradeScale}` : ''}` : '';
          return `• **${e.institution}**\n  *${e.program || e.level.toUpperCase()}* (${yrs})${gradeStr}`;
        })
        .join('\n\n');

      return {
        responseText: `🎓 **Academic Background & Education**:\n\n${eduList}`,
      };
    }

    if (lower.includes('location') || lower.includes('where is')) {
      const loc = profile.location;
      if (!loc) {
        return { responseText: 'No specific public location has been published.' };
      }
      return {
        responseText: `📍 **Current Base**:\n\n**${loc.displayText}**\nTimezone: ${loc.timezone || 'Local Time Zone'}`,
      };
    }

    // Default Fallback
    return {
      responseText:
        `Hello! I am Urvi's AI Design & Portfolio Assistant.\n\n` +
        `You can ask me about:\n` +
        `• Urvi's spatial design background & philosophy\n` +
        `• Education and architectural credentials\n` +
        `• Current location and studio availability\n` +
        (this.isOwner
          ? `\n👑 **Owner Mode Active:**\n` +
            `You can instruct me to update your profile (e.g. *"Update location to Mumbai, India"*, *"Add education..."*, or *"Hide my grade"*).`
          : ''),
    };
  }

  /**
   * Executes a confirmed pending action
   */
  async executeConfirmedAction(action: PendingAction): Promise<SaveProfileResult> {
    if (!this.isOwner) {
      throw new Error('Unauthorized');
    }

    switch (action.tool) {
      case 'updateAboutProfile':
        return await this.updateAboutProfile(action.payload as Partial<AboutProfile>);
      case 'addEducation':
        return await this.addEducation(action.payload as Omit<EducationEntry, 'id'>);
      case 'updateEducation': {
        const p = action.payload as { id: string; partial: Partial<EducationEntry> };
        return await this.updateEducation(p.id, p.partial);
      }
      case 'removeEducation': {
        const p = action.payload as { id: string };
        return await this.removeEducation(p.id);
      }
      default:
        throw new Error('Unknown tool action');
    }
  }
}
