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
      description: 'Сейчас мы изучим меню управления кассой. Нажмите "Далее", а затем кликните на иконку калькулятора.',
      isIntro: true
    },
    {
      id: 'open-menu',
      selector: '.cashier-header__right .img-green-hover',
      title: 'Откройте меню',
      description: 'Нажмите на эту иконку, чтобы развернуть панель управления сменной и кассой.',
      placement: 'bottom'
    },
    {
      id: 'shift-info',
      selector: '.dropdown-menu .control__info',
      title: 'Статус смены',
      description: 'Здесь видна информация о текущем кассире, режиме работы и времени открытия смены.',
      placement: 'left'
    },
    {
      id: 'cash-amount',
      selector: '.dropdown-menu .blue-text-medium',
      title: 'Наличные в кассе',
      description: 'Текущая сумма наличных. Проверяйте её перед выполнением операций внесения или изъятия.',
      placement: 'left'
    },
    {
      id: 'op-btns',
      selector: '.dropdown-menu .control__btns',
      title: 'Быстрые операции',
      description: 'Используйте эти кнопки для переключения режимов (Продажа/Возврат) или печати X-отчета.',
      placement: 'left'
    },
    {
      id: 'close-shift',
      selector: '.dropdown-menu .button-general.orange-fill',
      title: 'Закрыть смену',
      description: 'В конце рабочего дня нажмите эту кнопку для закрытия смены и печати Z-отчета.',
      placement: 'top'
    }
  ]
};
