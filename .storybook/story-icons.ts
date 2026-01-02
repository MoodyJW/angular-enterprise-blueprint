/**
 * Storybook Icon Registry
 *
 * Centralized icon imports for Storybook stories.
 * Only includes icons defined in ICON_NAMES for optimal bundle size.
 *
 * Usage in stories:
 *   import { STORY_ICONS } from '../../../.storybook/story-icons';
 *   decorators: [
 *     applicationConfig({ providers: [provideIcons(STORY_ICONS)] }),
 *   ],
 */
import { Provider } from '@angular/core';
import { provideIcons } from '@ng-icons/core';

// Heroicons Outline
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
  heroBuildingOffice2,
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

// Heroicons Solid
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

// Ionicons (logos)
import { ionLogoGithub, ionLogoLinkedin } from '@ng-icons/ionicons';

/**
 * All icons used in the application, for Storybook stories.
 * Matches icons defined in ICON_NAMES constant.
 */
export const STORY_ICONS = {
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
  heroBuildingOffice2,
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

  // Brand Logos
  ionLogoGithub,
  ionLogoLinkedin,
};

/**
 * Provider function for use in Storybook applicationConfig.
 * Returns all icons needed for story demonstrations.
 */
export function provideStoryIcons(): Provider {
  return provideIcons(STORY_ICONS);
}
