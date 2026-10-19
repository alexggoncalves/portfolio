import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// ======================
// BASE COMPONENTS
// ======================
const StrokeIcon = ({ children, ...props }: IconProps) => (
    <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        {children}
    </svg>
);

const FillIcon = ({ children, viewBox = "0 0 98 98", ...props }: IconProps) => (
    <svg
        width="1em"
        height="1em"
        viewBox={viewBox}
        fill="currentColor"
        aria-hidden="true"
        {...props}
    >
        {children}
    </svg>
);

// ======================
// STROKE ICONS
// ======================

export const MinimizeIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M5 12h14" />
    </StrokeIcon>
);

export const CloseIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M18 6 6 18M6 6l12 12" />
    </StrokeIcon>
);

export const ChevronLeft = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="m15 18-6-6 6-6" />
    </StrokeIcon>
);

export const ChevronRight = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="m9 18 6-6-6-6" />
    </StrokeIcon>
);

export const ChevronDown = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="m6 9 6 6 6-6" />
    </StrokeIcon>
);

export const ChevronUp = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="m18 15-6-6-6 6"></path>
    </StrokeIcon>
);

export const PlayIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
    </StrokeIcon>
);

export const PauseIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <rect width="5" height="18" x="14" y="3" rx="1" />
        <rect width="5" height="18" x="5" y="3" rx="1" />
    </StrokeIcon>
);

export const MaximizeIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
    </StrokeIcon>
);

export const VolumeIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM16 9a5 5 0 0 1 0 6M19.364 18.364a9 9 0 0 0 0-12.728" />
    </StrokeIcon>
);

export const MutedIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298zM16.5 14.5l5-5M16.5 9.5l5 5" />
    </StrokeIcon>
);

export const ToolsIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
    </StrokeIcon>
);

export const TeamIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" />
    </StrokeIcon>
);

export const CheckboxIcon = ({ active, ...props }: IconProps & { active: boolean }) => (
    <StrokeIcon {...props}>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        {active && <path d="m15 9-6 6M9 9l6 6" />}
    </StrokeIcon>
);

export const CopyIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <rect width="14" height="14" x="8" y="8" rx="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </StrokeIcon>
);

export const ExternalLinkIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </StrokeIcon>
);

export const PreviewIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56zM12 17v4M8 21h8" />
        <rect width="20" height="14" x="2" y="3" rx="2" />
    </StrokeIcon>
);

// ======================
// FILL ICONS (old design — swap for stroke versions when those screens get redesigned)
// ======================

export const FilterIcon = (props: IconProps) => (
    <FillIcon {...props}>
        <path d="M86.2,17.12v4.52c0,.6-.23,1.17-.64,1.61l-26.09,27.86c-.51.54-1.22.85-1.96.86l-8.51.1-8.51-.1c-.74,0-1.45-.32-1.96-.86L12.44,23.25c-.41-.44-.64-1.01-.64-1.61v-4.52c0-1.05.85-1.9,1.9-1.9l35.29.11,35.29-.11c1.05,0,1.9.85,1.9,1.9Z" />
        <path d="M40.55,55.63h16.96c.9,0,1.63.73,1.63,1.63v34.3c0,.93-1.01,1.51-1.81,1.05l-16.98-9.76c-.88-.51-1.42-1.44-1.42-2.46v-23.14c0-.9.73-1.63,1.63-1.63Z" />
    </FillIcon>
);

export const ArrowIcon = (props: IconProps) => (
    <FillIcon {...props}>
        <path d="M51.69,75.13c-1.49,1.49-3.9,1.49-5.39,0L14.1,42.93c-2.1-2.1-2.1-5.51,0-7.61,2.1-2.1,5.51-2.1,7.6,0l24.77,24.77c1.39,1.39,3.65,1.39,5.04,0l24.77-24.77c2.1-2.1,5.51-2.1,7.6,0,2.1,2.1,2.1,5.51,0,7.61l-32.2,32.2Z" />
    </FillIcon>
);

export const BurgerIcon = (props: IconProps) => (
    <FillIcon {...props}>
        <path d="M81.16,28.11c0,1.61-.66,3.08-1.72,4.14-1.06,1.06-2.53,1.72-4.15,1.72H22.71c-3.24,0-5.86-2.63-5.86-5.86,0-1.62.66-3.09,1.72-4.15,1.06-1.06,2.52-1.72,4.14-1.72h52.58c3.24,0,5.87,2.63,5.87,5.87Z" />
        <path d="M81.16,49c0,1.62-.66,3.09-1.72,4.15-1.06,1.06-2.53,1.72-4.15,1.72H22.71c-3.24,0-5.86-2.63-5.86-5.87,0-1.62.66-3.08,1.72-4.14s2.52-1.72,4.14-1.72h52.58c3.24,0,5.87,2.62,5.87,5.86Z" />
        <path d="M81.16,69.9c0,1.62-.66,3.09-1.72,4.15-1.06,1.06-2.53,1.72-4.15,1.72H22.71c-3.24,0-5.86-2.63-5.86-5.87,0-1.62.66-3.08,1.72-4.14s2.52-1.72,4.14-1.72h52.58c3.24,0,5.87,2.62,5.87,5.86Z" />
    </FillIcon>
);

export const GoToGridIcon = (props: IconProps) => (
    <FillIcon viewBox="0 0 151.69 83.53" width="1.82em" {...props}>
        <rect x="45.83" y="15.96" width="22.35" height="22.36" rx="6.45" />
        <rect x="15.88" y="15.96" width="22.35" height="22.36" rx="6.45" />
        <rect x="15.88" y="45.22" width="22.35" height="22.36" rx="6.45" />
        <rect x="45.83" y="45.22" width="22.35" height="22.36" rx="6.45" />
        <path d="M150.77,43.8l-16.17,13.56c-1.72,1.45-4.36.22-4.36-2.03v-6.44h-30.5c-2.3,0-4.15-1.85-4.15-4.15v-5.97c0-2.3,1.85-4.16,4.15-4.16h30.5v-6.42c0-2.25,2.63-3.48,4.36-2.03l16.17,13.56c1.26,1.06,1.26,3,0,4.06Z" />
    </FillIcon>
);

export const LinkedInIcon = (props: IconProps) => (
    <FillIcon viewBox="0 0 382 382" {...props}>
        <path d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472L341.91,330.654L341.91,330.654z" />
    </FillIcon>
);

export const GithubIcon = (props: IconProps) => (
    <FillIcon viewBox="0 0 98 96" {...props}>
        <path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" />
    </FillIcon>
);



