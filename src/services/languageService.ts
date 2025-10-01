import { supabase } from '../config/supabase';

export interface UserLanguagePreference {
  user_id: string;
  language: string;
  country?: string;
  browser_language?: string;
  created_at?: string;
  updated_at?: string;
}

export const languageService = {
  async getUserLanguagePreference(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('language')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user language preference:', error);
        return null;
      }

      return data?.language || null;
    } catch (error) {
      console.error('Error in getUserLanguagePreference:', error);
      return null;
    }
  },

  async saveUserLanguagePreference(
    userId: string,
    language: string,
    country?: string,
    browserLanguage?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: userId,
            language,
            country,
            browser_language: browserLanguage,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) {
        console.error('Error saving user language preference:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveUserLanguagePreference:', error);
      return false;
    }
  },

  async updateUserLanguage(userId: string, language: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ language, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user language:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserLanguage:', error);
      return false;
    }
  },

  detectBrowserLanguage(): string {
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = ['tr', 'en', 'de', 'ru', 'ar', 'zh'];

    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    return 'en';
  },

  async detectCountry(): Promise<string | null> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_code || null;
    } catch (error) {
      console.error('Error detecting country:', error);
      return null;
    }
  }
};
