// modules/dialog_parser.js
// Парсер команд ІСКРИ-Один: витягує дію та ціль із тексту

function parse(input) {
  const lowered = input.trim().toLowerCase();

  // Команда: покажи статус
  if (lowered === 'покажи статус') {
    return { valid: true, action: 'show', target: 'status.json' };
  }

  // Команда: покажи файл
  if (lowered.startsWith('покажи ')) {
    const fileName = lowered.replace('покажи ', '').trim();
    return { valid: true, action: 'show', target: fileName };
  }

  // Команда: створи логіку для ...
  if (lowered.startsWith('створи логіку для')) {
    const name = lowered.replace('створи логіку для', '').trim();
    const fileName = name.replace(/\s+/g, '_').toLowerCase() + '_strategy.js';
    return { valid: true, action: 'create_strategy', target: fileName };
  }

  // Команда: створи файл ...
  if (lowered.startsWith('створи файл')) {
    const name = lowered.replace('створи файл', '').trim();
    const fileName = name.replace(/\s+/g, '_').toLowerCase();
    return { valid: true, action: 'create_file', target: fileName };
  }

  // Команда: навчи AI
  if (lowered.includes('навчи ai') || lowered.includes('навчи штучний інтелект')) {
    return { valid: true, action: 'train_ai', target: 'trades.json' };
  }

  // Команда: запусти тестову угоду
  if (lowered.includes('тестова угода') || lowered.includes('запусти тест')) {
    return { valid: true, action: 'test_trade', target: 'single' };
  }

  // Команда: увімкни автотрейд
  if (lowered.includes('увімкни автотрейд') || lowered.includes('включи автотрейд')) {
    return { valid: true, action: 'autotrade_on', target: 'status.json' };
  }

  // Команда: вимкни автотрейд
  if (lowered.includes('вимкни автотрейд') || lowered.includes('зупини автотрейд')) {
    return { valid: true, action: 'autotrade_off', target: 'status.json' };
  }

  return { valid: false };
}

module.exports = { parse };
