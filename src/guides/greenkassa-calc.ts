import { Guide } from '../core/types';

export const greenkassaCalcGuide: Guide = {
  id: 'greenkassa-calc',
  name: 'Управление кассой и сменой',
  matches: ['cabinet.stage.greenkassa.kz'],
  steps: [
    {
      id: 'calc-intro',
      selector: '',
      title: 'Функции управления ⚙️',
      description: 'В этом меню вы можете управлять состоянием кассы, менять режимы работы и закрывать смену.',
      isIntro: true
    },
    {
      id: 'shift-info',
      selector: '.control__info',
      title: 'Статус смены',
      description: 'Здесь видна информация о текущем кассире, режиме (Продажа/Покупка) и времени открытия смены.',
      placement: 'left'
    },
    {
      id: 'cash-amount',
      selector: '.blue-text-medium',
      title: 'Наличные в кассе',
      description: 'Текущая сумма наличных денег. Проверяйте её перед изъятием или внесением.',
      placement: 'left'
    },
    {
      id: 'op-btns',
      selector: '.control__btns',
      title: 'Операции',
      description: 'Кнопки для быстрой смены режима: Продажа, Возврат или X-отчет.',
      placement: 'left'
    },
    {
      id: 'close-shift',
      selector: '.button-general.orange-fill.mini',
      title: 'Закрыть смену',
      description: 'Нажмите здесь в конце рабочего дня, чтобы сформировать Z-отчет и закрыть смену.',
      placement: 'top'
    }
  ]
};
