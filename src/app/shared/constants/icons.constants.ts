/**
 * Icon Registry
 *
 * Centralized icon imports and type definitions for the application.
 * Uses Heroicons (outline and solid variants) from @ng-icons/heroicons
 * and Ionicons for brand logos from @ng-icons/ionicons.
 *
 * @example
 * ```typescript
 * import { ICON_REGISTRY, ICON_NAMES } from '@shared/constants/icons.constants';
 *
 * // In component
 * @Component({
 *   viewProviders: [provideIcons(ICON_REGISTRY)]
 * })
 * export class MyComponent {
 *   readonly iconName = ICON_NAMES.HOME;
 * }
 * ```
 */

// Ionicons imports (for brand logos)
// Heroicons Outline imports
import {
  heroAcademicCap,
  heroArrowDown,
  heroArrowDownTray,
  heroArrowLeft,
  heroArrowPath,
  heroArrowRight,
  heroArrowTopRightOnSquare,
  heroArrowUp,
  heroAtSymbol,
  heroBars3,
  heroBeaker,
  heroBell,
  heroBolt,
  heroBookmark,
  heroBriefcase,
  heroCalendar,
  heroChartBar,
  heroChatBubbleLeft,
  heroChatBubbleLeftRight,
  heroCheck,
  heroCheckCircle,
  heroChevronDown,
  heroChevronLeft,
  heroChevronRight,
  heroChevronUp,
  heroClipboard,
  heroClock,
  heroCloud,
  heroCodeBracket,
  heroCog6Tooth,
  heroCommandLine,
  heroComputerDesktop,
  heroCpuChip,
  heroCube,
  heroDevicePhoneMobile,
  heroDocument,
  heroDocumentText,
  heroEllipsisHorizontal,
  heroEllipsisVertical,
  heroEnvelope,
  heroExclamationTriangle,
  heroEye,
  heroEyeSlash,
  heroFaceFrown,
  heroFaceSmile,
  heroFilm,
  heroFire,
  heroFlag,
  heroFolder,
  heroGlobeAlt,
  heroGlobeAsiaAustralia,
  heroHandThumbDown,
  heroHandThumbUp,
  heroHashtag,
  heroHeart,
  heroHome,
  heroInformationCircle,
  heroLightBulb,
  heroLink,
  heroListBullet,
  heroMagnifyingGlass,
  heroMapPin,
  heroMinus,
  heroMoon,
  heroMusicalNote,
  heroPaperAirplane,
  heroPencil,
  heroPhone,
  heroPhoto,
  heroPlus,
  heroQueueList,
  heroRocketLaunch,
  heroServerStack,
  heroShare,
  heroShoppingCart,
  heroSignal,
  heroSparkles,
  heroSquares2x2,
  heroStar,
  heroSun,
  heroTableCells,
  heroTag,
  heroTrash,
  heroTrophy,
  heroUser,
  heroUserCircle,
  heroUserGroup,
  heroWifi,
  heroXCircle,
  heroXMark,
} from '@ng-icons/heroicons/outline';
// Heroicons Solid imports (for filled variants)
import {
  heroBellSolid,
  heroBookmarkSolid,
  heroCheckCircleSolid,
  heroExclamationTriangleSolid,
  heroHeartSolid,
  heroHomeSolid,
  heroInformationCircleSolid,
  heroMoonSolid,
  heroShoppingCartSolid,
  heroStarSolid,
  heroSunSolid,
  heroUserSolid,
  heroXCircleSolid,
} from '@ng-icons/heroicons/solid';
import { ionLogoGithub, ionLogoLinkedin } from '@ng-icons/ionicons';

/**
 * Icon registry object containing all available icons
 * Pass this to provideIcons() in component viewProviders
 */
export const ICON_REGISTRY = {
  // Brand Logos (Ionicons)
  ionLogoGithub,
  ionLogoLinkedin,

  // Navigation
  heroArrowLeft,
  heroArrowRight,
  heroArrowUp,
  heroArrowDown,
  heroBars3,
  heroXMark,
  heroCheck,
  heroChevronDown,
  heroChevronLeft,
  heroChevronRight,
  heroChevronUp,
  heroHome,
  heroHomeSolid,

  // User & Profile
  heroUser,
  heroUserSolid,
  heroUserGroup,
  heroUserCircle,

  // Communication
  heroEnvelope,
  heroChatBubbleLeft,
  heroChatBubbleLeftRight,
  heroPaperAirplane,
  heroPhone,
  heroAtSymbol,

  // Work & Business
  heroBriefcase,
  heroDocumentText,
  heroCodeBracket,
  heroAcademicCap,
  heroFolder,
  heroDocument,

  // Feedback & Status
  heroStar,
  heroStarSolid,
  heroHeart,
  heroHeartSolid,
  heroCheckCircle,
  heroCheckCircleSolid,
  heroXCircle,
  heroXCircleSolid,
  heroExclamationTriangle,
  heroExclamationTriangleSolid,
  heroInformationCircle,
  heroInformationCircleSolid,

  // Actions
  heroMagnifyingGlass,
  heroCog6Tooth,
  heroBell,
  heroBellSolid,
  heroShoppingCart,
  heroShoppingCartSolid,
  heroEye,
  heroEyeSlash,
  heroPencil,
  heroTrash,
  heroPlus,
  heroMinus,
  heroArrowPath,
  heroLink,
  heroArrowTopRightOnSquare,
  heroArrowDownTray,
  heroClipboard,
  heroShare,

  // Theme
  heroMoon,
  heroMoonSolid,
  heroSun,
  heroSunSolid,
  heroGlobeAlt,

  // Time & Calendar
  heroCalendar,
  heroClock,

  // Organization
  heroTag,
  heroBookmark,
  heroBookmarkSolid,
  heroHashtag,

  // Media
  heroPhoto,
  heroFilm,
  heroMusicalNote,

  // Data & Charts
  heroChartBar,
  heroTableCells,
  heroListBullet,
  heroQueueList,
  heroSquares2x2,

  // Tech & Development
  heroBeaker,
  heroLightBulb,
  heroCube,
  heroCommandLine,
  heroServerStack,
  heroCloud,
  heroCpuChip,
  heroDevicePhoneMobile,
  heroComputerDesktop,
  heroWifi,
  heroSignal,

  // Engagement
  heroBolt,
  heroFire,
  heroSparkles,
  heroRocketLaunch,
  heroTrophy,
  heroFlag,

  // Location
  heroMapPin,
  heroGlobeAsiaAustralia,

  // More Actions
  heroEllipsisHorizontal,
  heroEllipsisVertical,
  heroHandThumbUp,
  heroHandThumbDown,
  heroFaceSmile,
  heroFaceFrown,
} as const;

/**
 * Type-safe icon names
 * Use this to ensure you're using valid icon names
 */
export type IconName = keyof typeof ICON_REGISTRY;

/**
 * Icon name constants for type-safe usage throughout the app
 * Organized by category for easy discovery
 */
export const ICON_NAMES = {
  // Brand Logos
  GITHUB: 'ionLogoGithub' as IconName,
  LINKEDIN: 'ionLogoLinkedin' as IconName,

  // Navigation
  ARROW_LEFT: 'heroArrowLeft' as IconName,
  ARROW_RIGHT: 'heroArrowRight' as IconName,
  ARROW_UP: 'heroArrowUp' as IconName,
  ARROW_DOWN: 'heroArrowDown' as IconName,
  MENU: 'heroBars3' as IconName,
  CLOSE: 'heroXMark' as IconName,
  CHECK: 'heroCheck' as IconName,
  CHEVRON_DOWN: 'heroChevronDown' as IconName,
  CHEVRON_LEFT: 'heroChevronLeft' as IconName,
  CHEVRON_RIGHT: 'heroChevronRight' as IconName,
  CHEVRON_UP: 'heroChevronUp' as IconName,
  HOME: 'heroHome' as IconName,
  HOME_SOLID: 'heroHomeSolid' as IconName,

  // User & Profile
  USER: 'heroUser' as IconName,
  USER_SOLID: 'heroUserSolid' as IconName,
  USER_GROUP: 'heroUserGroup' as IconName,
  USER_CIRCLE: 'heroUserCircle' as IconName,

  // Communication
  EMAIL: 'heroEnvelope' as IconName,
  CHAT: 'heroChatBubbleLeft' as IconName,
  CHAT_MULTIPLE: 'heroChatBubbleLeftRight' as IconName,
  SEND: 'heroPaperAirplane' as IconName,
  PHONE: 'heroPhone' as IconName,
  AT: 'heroAtSymbol' as IconName,

  // Work & Business
  BRIEFCASE: 'heroBriefcase' as IconName,
  DOCUMENT: 'heroDocumentText' as IconName,
  CODE: 'heroCodeBracket' as IconName,
  EDUCATION: 'heroAcademicCap' as IconName,
  FOLDER: 'heroFolder' as IconName,
  FILE: 'heroDocument' as IconName,

  // Feedback & Status
  STAR: 'heroStar' as IconName,
  STAR_SOLID: 'heroStarSolid' as IconName,
  HEART: 'heroHeart' as IconName,
  HEART_SOLID: 'heroHeartSolid' as IconName,
  SUCCESS: 'heroCheckCircle' as IconName,
  SUCCESS_SOLID: 'heroCheckCircleSolid' as IconName,
  ERROR: 'heroXCircle' as IconName,
  ERROR_SOLID: 'heroXCircleSolid' as IconName,
  WARNING: 'heroExclamationTriangle' as IconName,
  WARNING_SOLID: 'heroExclamationTriangleSolid' as IconName,
  INFO: 'heroInformationCircle' as IconName,
  INFO_SOLID: 'heroInformationCircleSolid' as IconName,

  // Actions
  SEARCH: 'heroMagnifyingGlass' as IconName,
  SETTINGS: 'heroCog6Tooth' as IconName,
  NOTIFICATION: 'heroBell' as IconName,
  NOTIFICATION_SOLID: 'heroBellSolid' as IconName,
  CART: 'heroShoppingCart' as IconName,
  CART_SOLID: 'heroShoppingCartSolid' as IconName,
  EYE: 'heroEye' as IconName,
  EYE_OFF: 'heroEyeSlash' as IconName,
  EDIT: 'heroPencil' as IconName,
  DELETE: 'heroTrash' as IconName,
  ADD: 'heroPlus' as IconName,
  REMOVE: 'heroMinus' as IconName,
  REFRESH: 'heroArrowPath' as IconName,
  LINK: 'heroLink' as IconName,
  EXTERNAL_LINK: 'heroArrowTopRightOnSquare' as IconName,
  DOWNLOAD: 'heroArrowDownTray' as IconName,
  COPY: 'heroClipboard' as IconName,
  SHARE: 'heroShare' as IconName,

  // Theme
  MOON: 'heroMoon' as IconName,
  MOON_SOLID: 'heroMoonSolid' as IconName,
  SUN: 'heroSun' as IconName,
  SUN_SOLID: 'heroSunSolid' as IconName,
  GLOBE: 'heroGlobeAlt' as IconName,

  // Time & Calendar
  CALENDAR: 'heroCalendar' as IconName,
  CLOCK: 'heroClock' as IconName,

  // Organization
  TAG: 'heroTag' as IconName,
  BOOKMARK: 'heroBookmark' as IconName,
  BOOKMARK_SOLID: 'heroBookmarkSolid' as IconName,
  HASHTAG: 'heroHashtag' as IconName,

  // Media
  PHOTO: 'heroPhoto' as IconName,
  VIDEO: 'heroFilm' as IconName,
  MUSIC: 'heroMusicalNote' as IconName,

  // Data & Charts
  CHART: 'heroChartBar' as IconName,
  TABLE: 'heroTableCells' as IconName,
  LIST: 'heroListBullet' as IconName,
  QUEUE: 'heroQueueList' as IconName,
  GRID: 'heroSquares2x2' as IconName,

  // Tech & Development
  BEAKER: 'heroBeaker' as IconName,
  LIGHTBULB: 'heroLightBulb' as IconName,
  CUBE: 'heroCube' as IconName,
  TERMINAL: 'heroCommandLine' as IconName,
  SERVER: 'heroServerStack' as IconName,
  CLOUD: 'heroCloud' as IconName,
  CPU: 'heroCpuChip' as IconName,
  MOBILE: 'heroDevicePhoneMobile' as IconName,
  DESKTOP: 'heroComputerDesktop' as IconName,
  WIFI: 'heroWifi' as IconName,
  SIGNAL: 'heroSignal' as IconName,

  // Engagement
  BOLT: 'heroBolt' as IconName,
  FIRE: 'heroFire' as IconName,
  SPARKLES: 'heroSparkles' as IconName,
  ROCKET: 'heroRocketLaunch' as IconName,
  TROPHY: 'heroTrophy' as IconName,
  FLAG: 'heroFlag' as IconName,

  // Location
  MAP_PIN: 'heroMapPin' as IconName,
  GLOBE_ASIA: 'heroGlobeAsiaAustralia' as IconName,

  // More Actions
  MORE_HORIZONTAL: 'heroEllipsisHorizontal' as IconName,
  MORE_VERTICAL: 'heroEllipsisVertical' as IconName,
  THUMB_UP: 'heroHandThumbUp' as IconName,
  THUMB_DOWN: 'heroHandThumbDown' as IconName,
  SMILE: 'heroFaceSmile' as IconName,
  FROWN: 'heroFaceFrown' as IconName,
} as const;
