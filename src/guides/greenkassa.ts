import { Guide } from '../core/types';

export const greenkassaGuide: Guide = {
  id: 'greenkassa-onboarding',
  name: 'Знакомство с GreenKassa',
  matches: ['cabinet.stage.greenkassa.kz'],
  steps: [
    {
      id: 'intro',
      selector: '',
      title: 'Добро пожаловать в GreenKassa! 👋',
      description: 'Мы подготовили для вас короткий интерактивный тур по кабинету кассира, чтобы вы могли быстро освоиться с основными функциями.',
      isIntro: true
    },
    {
      id: 'org-info',
      selector: '.cashier__info',
      title: 'Организация и БИН',
      description: 'Здесь отображается название вашей организации и её БИН. Проверьте правильность данных.',
      placement: 'bottom'
    },
    {
      id: 'cash-tariff',
      selector: '.cashier-header__left > div:nth-child(3)',
      title: 'Касса и Тариф',
      description: 'Название текущей кассы и статус вашего тарифа. Если тариф не активен, его нужно продлить.',
      placement: 'bottom'
    },
    {
      id: 'calculator-icon',
      selector: '.cashier-header__right .img-green-hover',
      title: 'Калькулятор / Чеки',
      description: 'Нажмите на эту иконку, чтобы открыть функционал загрузки чеков или калькулятор.',
      placement: 'bottom'
    },
    {
      id: 'sum-input',
      selector: 'input[placeholder="0 ₸"]',
      title: 'Ввод суммы',
      description: 'Введите сумму продажи в это поле.',
      placement: 'bottom'
    },
    {
      id: 'add-btn',
      selector: '.tablo__bottom .button-general',
      title: 'Добавить в чек',
      description: 'Нажмите "Добавить", чтобы позиция попала в список текущего чека.',
      placement: 'top'
    },
    {
      id: 'items-table',
      selector: '.table-wrapper',
      title: 'Список товаров',
      description: 'Здесь будут отображаться все добавленные позиции. Вы можете их редактировать или удалять.',
      placement: 'top'
    },
    {
      id: 'payment-type',
      selector: '.cash__right .tw-flex.tw-gap-2.tw-flex-col',
      title: 'Тип оплаты',
      description: 'Выберите, как покупатель будет оплачивать: наличными, картой или через QR.',
      placement: 'left'
    },
    {
      id: 'submit-check',
      selector: '.cash__right .button-general.large',
      title: 'Выбить чек',
      description: 'Финальный шаг. Нажмите эту кнопку, чтобы фискализировать чек и завершить продажу.',
      placement: 'top'
    }
  ]
};
