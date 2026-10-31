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
// ICONS
// ======================

export const Logo = (props: IconProps) => (
    <FillIcon {...props} viewBox="0 0 160 56" width="2.86em">
        <path d="M54.6 55.12H33.88V46h4.16l-1.92-5.28H18.44L16.28 46h4.88v9.12H.68V46H5.4l14.88-33.76h-7.2V3.12h17.84L49.64 46h4.96zM33.24 33.04 27.8 18.4h-.48l-5.84 14.64zM76.44 55.12H56.52v-7.76h4.8V7.92h-5.2V.08h15.52v47.28h4.8zM115.4 43.76c-.27 3.2-1.84 6.03-4.72 8.48s-6.91 3.68-12.08 3.68-9.83-1.52-13.32-4.56-5.24-7.57-5.24-13.6c0-5.55 1.59-10.17 4.76-13.88s7.61-5.56 13.32-5.56c5.01 0 9.08 1.44 12.2 4.32s4.71 6.67 4.76 11.36c0 1.76-.19 3.49-.56 5.2H90.84c.59 5.71 3.41 8.56 8.48 8.56 2.77 0 4.65-.67 5.64-2q1.485-1.995 1.8-3.6zM104.44 33.2c.21-1.81-.17-3.52-1.16-5.12q-1.485-2.4-5.16-2.4c-2.13 0-3.79.69-4.96 2.08s-1.92 3.2-2.24 5.44zM159.32 55.12h-18.16v-7.76h2.64l-5.28-5.68-5.2 5.68h2.32v7.76h-16.88v-7.76h4.96l9.92-10-10.88-10.56h-3.6v-7.76h18.24v7.76h-2.48l4.88 5.36 5.2-5.36h-2.4v-7.76h15.68v7.76h-3.6l-9.84 9.44 10.96 11.12h3.52z" />
    </FillIcon>
);

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
    <FillIcon viewBox="0 0 24 24" {...props}>
        <path d="M5 5a2 2 0 0 1 2-2c.35 0 .7.09 1.01.27l12 7c.96.55 1.28 1.78.73 2.73-.17.3-.42.55-.72.72l-12 7c-.95.56-2.18.23-2.74-.72-.18-.31-.27-.65-.27-1.01V5Z" />
    </FillIcon>
);

export const PauseIcon = (props: IconProps) => (
    <FillIcon viewBox="0 0 24 24" {...props}>
        <rect width="5" height="18" x="14" y="3" rx="1" ry="1" />
        <rect width="5" height="18" x="5" y="3" rx="1" ry="1" />
    </FillIcon>
);

export const MaximizeMediaIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
    </StrokeIcon>
);

export const MinimizeMediaIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
    </StrokeIcon>
);

export const FitMediaIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="m14 10 7-7M20 10h-6V4M3 21l7-7M4 14h6v6" />
    </StrokeIcon>
);

export const CoverMediaIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M15 3h6v6M21 3l-7 7M3 21l7-7M9 21H3v-6" />
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
        <rect
            width="20" height="20" x="2" y="2" rx="4"
            fill="currentColor"
            fillOpacity={active ? 1 : 0}
        />
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

export const EyeIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </StrokeIcon>
);

export const EyeClosedIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="m15 18-.722-3.25M2 8a10.645 10.645 0 0 0 20 0M20 15l-1.726-2.05M4 15l1.726-2.05M9 18l.722-3.25"></path>
    </StrokeIcon>
);

export const ReturnIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
        <path d="m9 10-5 5 5 5"></path>
    </StrokeIcon>
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

export const BrushIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="m16 22-1-4M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1"></path>
        <path d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233zM8 22l1-4"></path>
    </StrokeIcon>
);

export const SmileIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M15 10V9M16.472 15a6 6 0 0 1-8.943 0M9 10V9"></path>
        <circle cx="12" cy="12" r="10"></circle>
    </StrokeIcon>
);

export const StarIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
    </StrokeIcon>
);

export const AtIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"></path>
    </StrokeIcon>
);

export const ArrowUpRightIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M7 7h10v10M7 17 17 7"></path>
    </StrokeIcon>
);

export const DownloadIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M12 15V3M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <path d="m7 10 5 5 5-5"></path>
    </StrokeIcon>
);

export const CurriculumIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
        <path d="M14 2v5a1 1 0 0 0 1 1h5M16 22a4 4 0 0 0-8 0"></path>
        <circle cx="12" cy="15" r="3"></circle>
    </StrokeIcon>
);

export const PinIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
    </StrokeIcon>
);

export const ClockIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
    </StrokeIcon>
);

export const PhoneIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
    </StrokeIcon>
);

export const MenuIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
       <path d="M3 5h18M3 12h18M3 19h18"></path>
    </StrokeIcon>
);

export const FilterIcon = (props: IconProps) => (
    <StrokeIcon {...props}>
        <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
    </StrokeIcon>
);
