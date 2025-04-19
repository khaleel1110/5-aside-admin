export interface NavigationType {
  label: string;
  icon?: string;
  matches: string,
  disabled?: boolean;
  badge?: {
    tone: string,
    text: string
  },
  secondaryAction?: {
    accessibilityLabel?: string,
    icon: string,
    tooltip: {
      content: string,
    },
  },
  subNavigationItems?: NavigationType[],
  collapsedSubNavigationItems?: boolean,
  onClick?: () => void,

}

export const mainNavigationList: NavigationType[] = [
  {
    label: 'Dashboard',
    icon: 'HomeMajor',
    matches: 'dashboards',
  },
  {
    label: 'Staff',
    icon: 'CustomersMajor',
    badge: {
      tone: 'attention',
      text: 'New'
    },
    onClick: () => {

    },
    matches: 'student-list',
  },
  {
    label: 'Exam',
    disabled: true,
    icon: 'BlogMajor',
    onClick: () => {

    },
    matches: 'exam-list',
  },
  {
    label: ' Department ',
    disabled: true,
    icon: 'ComposeMajor',
    onClick: () => {
    },
    matches: 'department',
  },
  {
    label: ' Exam Control ',
    disabled: true,
    icon: 'PlayCircleMajor',
    onClick: () => {
    },
    matches: 'exam-control',
  },
  {
    label: 'Notes/ Lectures',
    disabled: true,
    icon: 'AddNoteMajor',
    onClick: () => {
    },
    matches: 'tutorial-list',
  }, {
    label: 'Tutorials',
    disabled: true,
    icon: 'YoutubeMinor',
    onClick: () => {
    },
    matches: 'video-tutorials',
  },
  /* {
     label: 'Debug',
     disabled: true,
     icon: 'PlayCircleMajor',
     onClick: () => {
     },
     matches: 'debugging',
   },*/
  /* {
     label: 'farmers',
     disabled: true,
     icon: 'PlayCircleMajor',
     onClick: () => {
     },
     matches: 'farmers',
   },
   {
     label: 'Bulk SMS',
     disabled: true,
     icon: 'ComposeMajor',
     onClick: () => {
     },
     matches: 'bulk-sms',
   },
   {
     label: 'Crop prices',
     icon: 'TransactionFeeDollarMajor',
     onClick: () => {
     },
     matches: 'crop-prices',
   }*/]

export const integrations: NavigationType[] = [
  /* {
     label: 'YieldEx website',
     icon: 'GlobeMajor',
     onClick: () => {
       window.open('https://cbt-sass.web.app/', '_blank', 'noreferrer')
     },
     secondaryAction: {
       icon: 'ExternalMinor',
       tooltip: {
         content: 'Open YieldEx public website',
       },
     },
     matches: 'website',

   },
   {
     label: 'Zoho mail',
     icon: 'EmailMajor',
     onClick: () => {
       window.open('https://mail.zoho.com', '_blank', 'noreferrer')
     },
     matches: 'zoho',
     secondaryAction: {
       accessibilityLabel: 'OLp',
       icon: 'ExternalMinor',
       tooltip: {
         content: 'Open Zoho mail to check your emails',
       },
     },
   },
   {
     label: 'Google drive',
     icon: 'FolderUpMajor ',
     onClick: () => {
       window.open('https://drive.google.com/drive/folders/1-1HQpf7u4ujvLsvTUaMFuU0cQG0Lc5qB', '_blank', 'noreferrer')
     },
     matches: 'gdrive',
     secondaryAction: {
       accessibilityLabel: 'radio',
       icon: 'ExternalMinor',
       tooltip: {
         content: 'Open Google drive to view shared files',
       },
     },
   },*/
]
