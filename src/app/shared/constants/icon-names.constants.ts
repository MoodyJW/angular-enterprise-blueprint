/**
 * Icon Name Constants
 *
 * Lightweight string constants for icon names.
 * This file allows components to import icon names without pulling in the entire icon registry/library.
 * Used for tree-shaking optimization.
 */

export const ICON_NAMES = {
  // Brand Logos
  GITHUB: 'ionLogoGithub',
  LINKEDIN: 'ionLogoLinkedin',

  // Navigation
  ARROW_LEFT: 'heroArrowLeft',
  ARROW_RIGHT: 'heroArrowRight',
  ARROW_UP: 'heroArrowUp',
  ARROW_DOWN: 'heroArrowDown',
  MENU: 'heroBars3',
  CLOSE: 'heroXMark',
  CHECK: 'heroCheck',
  CHEVRON_DOWN: 'heroChevronDown',
  CHEVRON_LEFT: 'heroChevronLeft',
  CHEVRON_RIGHT: 'heroChevronRight',
  CHEVRON_UP: 'heroChevronUp',
  HOME: 'heroHome',
  HOME_SOLID: 'heroHomeSolid',

  // User & Profile
  USER: 'heroUser',
  USER_SOLID: 'heroUserSolid',
  USER_GROUP: 'heroUserGroup',
  USER_CIRCLE: 'heroUserCircle',

  // Communication
  EMAIL: 'heroEnvelope',
  CHAT: 'heroChatBubbleLeft',
  CHAT_MULTIPLE: 'heroChatBubbleLeftRight',
  SEND: 'heroPaperAirplane',
  PHONE: 'heroPhone',
  AT: 'heroAtSymbol',

  // Work & Business
  BRIEFCASE: 'heroBriefcase',
  DOCUMENT: 'heroDocumentText',
  CODE: 'heroCodeBracket',
  EDUCATION: 'heroAcademicCap',
  FOLDER: 'heroFolder',
  FILE: 'heroDocument',

  // Feedback & Status
  STAR: 'heroStar',
  STAR_SOLID: 'heroStarSolid',
  HEART: 'heroHeart',
  HEART_SOLID: 'heroHeartSolid',
  SUCCESS: 'heroCheckCircle',
  SUCCESS_SOLID: 'heroCheckCircleSolid',
  ERROR: 'heroXCircle',
  ERROR_SOLID: 'heroXCircleSolid',
  WARNING: 'heroExclamationTriangle',
  WARNING_SOLID: 'heroExclamationTriangleSolid',
  INFO: 'heroInformationCircle',
  INFO_SOLID: 'heroInformationCircleSolid',

  // Actions
  SEARCH: 'heroMagnifyingGlass',
  SETTINGS: 'heroCog6Tooth',
  NOTIFICATION: 'heroBell',
  NOTIFICATION_SOLID: 'heroBellSolid',
  CART: 'heroShoppingCart',
  CART_SOLID: 'heroShoppingCartSolid',
  EYE: 'heroEye',
  EYE_OFF: 'heroEyeSlash',
  EDIT: 'heroPencil',
  DELETE: 'heroTrash',
  ADD: 'heroPlus',
  REMOVE: 'heroMinus',
  REFRESH: 'heroArrowPath',
  LINK: 'heroLink',
  EXTERNAL_LINK: 'heroArrowTopRightOnSquare',
  DOWNLOAD: 'heroArrowDownTray',
  COPY: 'heroClipboard',
  SHARE: 'heroShare',

  // Theme
  MOON: 'heroMoon',
  MOON_SOLID: 'heroMoonSolid',
  SUN: 'heroSun',
  SUN_SOLID: 'heroSunSolid',
  GLOBE: 'heroGlobeAlt',

  // Time & Calendar
  CALENDAR: 'heroCalendar',
  CLOCK: 'heroClock',

  // Organization
  TAG: 'heroTag',
  BOOKMARK: 'heroBookmark',
  BOOKMARK_SOLID: 'heroBookmarkSolid',
  HASHTAG: 'heroHashtag',

  // Media
  PHOTO: 'heroPhoto',
  VIDEO: 'heroFilm',
  MUSIC: 'heroMusicalNote',

  // Data & Charts
  CHART: 'heroChartBar',
  TABLE: 'heroTableCells',
  LIST: 'heroListBullet',
  QUEUE: 'heroQueueList',
  GRID: 'heroSquares2x2',

  // Tech & Development
  BEAKER: 'heroBeaker',
  LIGHTBULB: 'heroLightBulb',
  CUBE: 'heroCube',
  TERMINAL: 'heroCommandLine',
  SERVER: 'heroServerStack',
  CLOUD: 'heroCloud',
  CPU: 'heroCpuChip',
  MOBILE: 'heroDevicePhoneMobile',
  DESKTOP: 'heroComputerDesktop',
  WIFI: 'heroWifi',
  SIGNAL: 'heroSignal',

  // Engagement
  BOLT: 'heroBolt',
  FIRE: 'heroFire',
  SPARKLES: 'heroSparkles',
  ROCKET: 'heroRocketLaunch',
  TROPHY: 'heroTrophy',
  FLAG: 'heroFlag',

  // Location
  MAP_PIN: 'heroMapPin',
  GLOBE_ASIA: 'heroGlobeAsiaAustralia',

  // More Actions
  MORE_HORIZONTAL: 'heroEllipsisHorizontal',
  MORE_VERTICAL: 'heroEllipsisVertical',
  THUMB_UP: 'heroHandThumbUp',
  THUMB_DOWN: 'heroHandThumbDown',
  SMILE: 'heroFaceSmile',
  FROWN: 'heroFaceFrown',
} as const;

export type IconName = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];
