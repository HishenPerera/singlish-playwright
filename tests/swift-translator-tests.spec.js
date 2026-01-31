const { test, expect } = require('@playwright/test');

// --- Configuration ---
const CONFIG = {
  url: 'https://www.swifttranslator.com/',
  timeouts: {
    pageLoad: 2000,
    afterClear: 1000,
    translation: 3000,
    betweenTests: 2000,
  },
  selectors: {
    inputField: 'Input Your Singlish Text Here.',
    outputContainer: '.w-full.h-80.p-3.rounded-lg.ring-1.ring-slate-300.whitespace-pre-wrap',
  },
};

// --- TranslatorPage Helper ---
class TranslatorPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToSite() {
    await this.page.goto(CONFIG.url);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(CONFIG.timeouts.pageLoad);
  }

  getInputField() {
    return this.page.getByRole('textbox', { name: CONFIG.selectors.inputField });
  }

  getOutputField() {
    return this.page.locator(CONFIG.selectors.outputContainer).first();
  }

  async clearInput() {
    const input = this.getInputField();
    await input.fill('');
    await this.page.waitForTimeout(CONFIG.timeouts.afterClear);
  }

  async typeInput(text, delay = 0) {
    const input = this.getInputField();
    await input.type(text, { delay });
  }

  async waitForTranslation(timeout = 10000) {
    await this.page.waitForFunction(
      (selector) => {
        const el = document.querySelector(selector);
        return el && el.textContent && el.textContent.trim().length > 0;
      },
      CONFIG.selectors.outputContainer,
      { timeout }
    );
    await this.page.waitForTimeout(CONFIG.timeouts.translation);
  }

  async getTranslation() {
    const output = this.getOutputField();
    const text = await output.textContent();
    return text?.trim() || '';
  }

  async performTranslation(text) {
    await this.clearInput();
    await this.typeInput(text);
    await this.waitForTranslation();
    return await this.getTranslation();
  }
}

// --- Test Data ---
const TEST_DATA = {
  positive: [

    // Simple sentences
    { 
      tcId: 'Pos_Fun_001', 
      input: 'mama paaree inne', 
      expected: 'මම පාරේ ඉන්නේ', 
      name: 'Simple sentences' 
    },
    { 
      tcId: 'Pos_Fun_002', 
      input: 'mata natanna oonee', 
      expected: 'මට නටන්න ඕනේ', 
      name: 'Simple sentences' 
    },
    { 
      tcId: 'Pos_Fun_003', 
      input: 'api panthi yanavaa', 
      expected: 'අපි පන්ති යනවා', 
      name: 'Simple sentences' 
    },

    // Compound sentences (two ideas joined)
    { 
      tcId: 'Pos_Fun_004', 
      input: 'mama sellam karaata passe raeeta kannam', 
      expected: 'මම සෙල්ලම් කරාට පස්සෙ රෑට කන්නම්', 
      name: 'Compound sentences' 
    },
    { 
      tcId: 'Pos_Fun_005', 
      input: 'api poth kiyavalaa ivaravelaa dhavalta kamu', 
      expected: 'අපි පොත් කියවලා ඉවරවෙලා දවල්ට කමු', 
      name: 'Compound sentences' 
    },

    // Complex sentences 
    { 
      tcId: 'Pos_Fun_006', 
      input: 'maarga thadhabadhaya nisa paree gaman kirima dhushkara vee', 
      expected: 'මාර්ග තදබදය නිස පරේ ගමන් කිරිම දුශ්කර වේ', 
      name: 'Complex sentences' 
    },

    // Questions sentences
    { 
      tcId: 'Pos_Fun_007', 
      input: 'oyaa monavadha karannee?', 
      expected: 'ඔයා මොනවද කරන්නේ?', 
      name: 'Questions sentences' 
    },
    { 
      tcId: 'Pos_Fun_008', 
      input: 'kavadhdha panthi thiyennee?', 
      expected: 'කවද්ද පන්ති තියෙන්නේ?', 
      name: 'Questions sentences' 
    },
    { 
      tcId: 'Pos_Fun_009', 
      input: 'api yannee kiiyatadha?', 
      expected: 'අපි යන්නේ කීයටද?', 
      name: 'Questions sentences' 
    },

    // Commands sentence
    {
      tcId: 'Pos_Fun_010',
      input: 'mehe balanna',
      expected: 'මෙහෙ බලන්න',
      name: 'Commands sentences' 
    },
    {
      tcId: 'Pos_Fun_011',
      input: 'athanata yanna',
      expected: 'අතනට යන්න',
      name: 'Commands sentences' 
    },

    // Greetings and Responses
    {
      tcId: 'Pos_Fun_012',
      input: 'magee subapaethum',
      expected: 'මගේ සුබපැතුම්',
      name: 'Greetings and Responses'
    },
    {
      tcId: 'Pos_Fun_013',
      input: 'karuNaakara nishshabdha vanna',
      expected: 'කරුණාකර නිශ්ශබ්ද වන්න',
      name: 'Greetings and Responses'
    },

    // Tense Variations
    {
      tcId: 'Pos_Fun_014',
      input: 'api iiyee gedhara giyooya',
      expected: 'අපි ඊයේ ගෙදර ගියෝය',
      name: 'Tense Variations - Past tense',
    },
    {
      tcId: 'Pos_Fun_015',
      input: 'mama heta nuvara yannemi',
      expected: 'මම හෙට නුවර යන්නෙමි',
      name: 'Tense Variations - Future tense',
    },

    // Plural and Pronouns
    {
      tcId: 'Pos_Fun_018',
      input: 'eyaalaa anidhdhaa yanavaa',
      expected: 'එයාලා අනිද්දා යනවා',
      name: 'Plural and Pronouns',
    },

    // Mixed Language
    {
      tcId: 'Pos_Fun_019',
      input: 'api Fast Food ekakin udheeta kamu',
      expected: 'අපි Fast Food එකකින් උදේට කමු',
      name: 'Mixed Language',
    },
    {
      tcId: 'Pos_Fun_020',
      input: 'magee Instagram account eka hack karalaa',
      expected: 'මගේ Instagram account එක hack කරලා',
      name: 'Mixed Language',
    },
    {
      tcId: 'Pos_Fun_021',
      input: 'mama heta France yanavaa',
      expected: 'මම හෙට France යනවා',
      name: 'Mixed Language',
      
    },
    
    // Punctuation
    {
      tcId: 'Pos_Fun_022',
      input: 'ahoo!',
      expected: 'අහෝ!',
      name: 'Punctuation',
    },
    
    // Numbers and Formats
    {
      tcId: 'Pos_Fun_023',
      input: 'ru. 5000k maaru oonaee',
      expected: 'රු. 5000ක් මාරු ඕනෑ',
      name: 'Numbers and Formats',
    },
    
    // Medium Length
    {
      tcId: 'Pos_Fun_024',
      input: 'oyaa enne naedhdha kiyala kalinma kiyanna mokadha mata kalinma kaema kanna oonaa asaniipa nisaa. ammaa rae 8ta dinner eka ready karaavi',
      expected: 'ඔයා එන්නෙ නැද්ද කියල කලින්ම කියන්න මොකද මට කලින්ම කැම කන්න ඕනා අසනීප නිසා. අම්මා රැ 8ට dinner එක ready කරාවි',
      name: 'Medium Length',
    }

  ],
  negative: [
    { 
      tcId: 'Neg_Fun_001', 
      input: 'mamaa gedddhara yanvaa', 
      expected: 'මම ගෙදර යනවා', 
      name: 'Repeated letters typo' 
    },
    { 
      tcId: 'Neg_Fun_002', 
      input: 'mata  nttanna oonee', 
      expected: 'මට නටන්න ඕනේ', 
      name: 'Extra spaces and missing letters' 
    },
    { 
      tcId: 'Neg_Fun_003', 
      input: 'apiyannemadhee', 
      expected: 'අපි යන්නෙ මදේ', 
      name: 'Joined words with missing spaces' 
    },
    { 
      tcId: 'Neg_Fun_004', 
      input: 'machaa supiriyaa neh', 
      expected: 'මචා සුපිරියා නෙ', 
      name: 'Informal slang + typo' 
    },
    { 
      tcId: 'Neg_Fun_005', 
      input: 'login karanna baee Facebook account eka', 
      expected: 'Facebook account එක login කරන්න බෑ', 
      name: 'English word misspelling' 
    },
    { 
      tcId: 'Neg_Fun_006', 
      input: 'mama kaaema kannnawaa', 
      expected: 'මම කෑම කන්නවා', 
      name: 'Partial words + spacing errors' 
    },
    { 
      tcId: 'Neg_Fun_007', 
      input: 'ada raa eeikka kanda', 
      expected: 'අද රෑ ඒක කන්න', 
      name: 'Colloquial miswriting' 
    },
    { 
      tcId: 'Neg_Fun_008', 
      input: 'mata WhatsAppek login karanna oonee', 
      expected: 'මට WhatsApp එක login කරන්න ඕනෑ', 
      name: 'Mixed Sinhala + English typo' 
    },
    { 
      tcId: 'Neg_Fun_009', 
      input: 'oyaaenneyanavaa', 
      expected: 'ඔයා එන්නේ යනවා', 
      name: 'Joined sentence without space' 
    },
    { 
      tcId: 'Neg_Fun_010', 
      input: 'bro eka set karala dena', 
      expected: 'bro ඒක set කරලා දෙන්න', 
      name: 'Slang + typo + spacing issues' 
    }
  ],
  ui: {
    tcId: 'Pos_UI_001',
    input: 'mama kaeema kannavaa',
    partialInput: 'mama kae',
    expectedFull: 'මම කෑම කන්නවා',
    name: 'Real-time translation updates as typing',
  },
};

// --- Test Suite ---
test.describe('SwiftTranslator - Singlish to Sinhala', () => {
  let translator;

  test.beforeEach(async ({ page }) => {
    translator = new TranslatorPage(page);
    await translator.navigateToSite();
  });

  // Positive Tests
  test.describe('Positive Functional Tests', () => {
    for (const tc of TEST_DATA.positive) {
      test(`${tc.tcId} - ${tc.name}`, async () => {
        const output = await translator.performTranslation(tc.input);
        expect(output).toBe(tc.expectedFull ?? tc.expected); // fallback for naming
        await translator.page.waitForTimeout(CONFIG.timeouts.betweenTests);
      });
    }
  });

  // Negative Tests
  test.describe('Negative Functional Tests', () => {
    for (const tc of TEST_DATA.negative) {
      test(`${tc.tcId} - ${tc.name}`, async () => {
        const output = await translator.performTranslation(tc.input);
        expect(output).toBe(tc.expected);
        await translator.page.waitForTimeout(CONFIG.timeouts.betweenTests);
      });
    }
  });

  // UI / Real-time Typing Test
  test.describe('UI Functionality Tests', () => {
    test(`${TEST_DATA.ui.tcId} - ${TEST_DATA.ui.name}`, async () => {
      const input = translator.getInputField();
      const output = translator.getOutputField();

      await translator.clearInput();

      // Type partial input slowly
      await input.type(TEST_DATA.ui.partialInput, { delay: 150 });
      await translator.page.waitForTimeout(1500);

      let partialOutput = await translator.getTranslation();
      expect(partialOutput.length).toBeGreaterThan(0);

      // Complete typing
      await input.type(TEST_DATA.ui.input.substring(TEST_DATA.ui.partialInput.length), { delay: 150 });

      await translator.waitForTranslation();
      const fullOutput = await translator.getTranslation();
      expect(fullOutput).toBe(TEST_DATA.ui.expectedFull);

      await translator.page.waitForTimeout(CONFIG.timeouts.betweenTests);
    });
  });
});
