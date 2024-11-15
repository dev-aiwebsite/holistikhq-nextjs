import { JSX, SVGProps } from "react";

type props = JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
export const AddTaskIcon = (props: props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {...props}>
    <path
      fill="currentColor"
      d="M95 19c-1.775 3.784-3.722 6.332-7 9-3.723-.375-6.968-1.72-10.438-3.063C66.453 21.218 55.58 22.041 45 27c-11.59 6.419-17.736 15.42-21.582 27.887-2.365 11.96.214 23.318 6.77 33.425C36.907 97.22 46.023 102.853 57 105c8.835.585 16.62-.127 25-3a679.453 679.453 0 0 1 4 3.875l2.25 2.18C90 110 90 110 90 112c-2.206.819-4.415 1.63-6.625 2.438l-3.727 1.37c-13.604 4.443-27.901 2.5-40.773-3.37-13.84-7.423-22.501-18.802-27.148-33.614C7.929 64.064 9.97 49.34 17.14 35.922 25.774 22.355 36.84 15.46 52 11c15.575-3.143 29.318.383 43 8Z"
    />
    <path
      fill="currentColor"
      d="M109 20c4.633 1.716 5.376 3.652 9 8L57 89c-7.875-6.75-7.875-6.75-11.402-10.305l-2.256-2.265-2.28-2.305-2.36-2.375A3393.364 3393.364 0 0 1 33 66a197.99 197.99 0 0 1 2.75-3.5l1.547-1.969C39 59 39 59 43 59c1.647 1.193 1.647 1.193 3.234 2.844l1.739 1.777L49.75 65.5l1.824 1.879A658.099 658.099 0 0 1 56 72c6.285-5.188 12.003-10.874 17.746-16.648l3.064-3.069c2.667-2.67 5.331-5.344 7.995-8.019 2.726-2.737 5.456-5.471 8.185-8.205C98.33 30.709 103.666 25.355 109 20ZM101 64h11v16h16v11h-16v16h-11V91H85V80h16V64Z"
    />
  </svg>
)
export const DashboardIcon = (props: props) => {
  return (
    <svg fill="currentColor" {...props} version="1.1" viewBox="0 0 32 32" stroke="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="dashboard_1_" d="M31,31.36H1c-0.199,0-0.36-0.161-0.36-0.36V1c0-0.199,0.161-0.36,0.36-0.36h30 c0.199,0,0.36,0.161,0.36,0.36v30C31.36,31.199,31.199,31.36,31,31.36z M1.36,30.64h29.28V12.36H1.36V30.64z M13.36,11.64h17.28 V1.36H13.36V11.64z M1.36,11.64h11.28V1.36H1.36V11.64z M9,27.36c-2.956,0-5.36-2.405-5.36-5.36h0.72c0,2.559,2.082,4.64,4.64,4.64 s4.64-2.081,4.64-4.64S11.559,17.36,9,17.36v-0.72c2.956,0,5.36,2.405,5.36,5.36S11.956,27.36,9,27.36z M27.36,27h-0.72V16h0.721 L27.36,27L27.36,27z M23.36,27h-0.72v-8h0.721L23.36,27L23.36,27z M19.36,27h-0.72v-3h0.721L19.36,27L19.36,27z"></path> <rect id="_Transparent_Rectangle" fill="none" width="32" height="32"></rect> </g></svg>
  );
};

export const MessageIcon = (props: props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={169.5}
    height={149.015}
    className="icon"
    viewBox="183.516 75.164 169.5 149.015"
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path d="M102.672 112.852H236V236H102.672Zm0 0" />
      </clipPath>
      <clipPath id="b">
        <path d="M155 139h117.172v123H155Zm0 0" />
      </clipPath>
    </defs>
    <g clipPath="url(#a)" transform="translate(80.845 -37.715)">
      <path
        fill="currentColor"
        d="M235.145 156.574c0-24.094-19.586-43.695-43.66-43.695h-45.157c-24.074 0-43.656 19.601-43.656 43.695v11.934c0 18.797 11.941 35.433 29.715 41.402l1.746.586-.922 1.598c-2.371 4.09-5.59 10.52-9.844 19.652a2.913 2.913 0 0 0 .567 3.266c.847.847 2.195 1.082 3.254.593l51.152-23.398h13.144c24.075 0 43.66-19.602 43.66-43.7Zm-5.797 11.934c0 20.902-16.985 37.906-37.864 37.906h-13.773c-.414 0-.832.09-1.207.262l-44.488 20.351 1.925-3.828c1.758-3.496 4.942-9.66 6.47-11.656l.171-.223.242-.148a2.877 2.877 0 0 0 1.375-2.11 2.9 2.9 0 0 0-2.375-3.222 37.834 37.834 0 0 1-31.363-37.332v-11.934c0-20.898 16.988-37.902 37.863-37.902h45.16c20.88 0 37.864 17.004 37.864 37.902Zm0 0"
      />
    </g>
    <path
      fill="currentColor"
      d="M215.625 117.606c-4.535 0-8.226 3.691-8.226 8.227 0 4.539 3.691 8.23 8.226 8.23 4.539 0 8.231-3.691 8.231-8.23 0-4.536-3.692-8.227-8.231-8.227ZM283.875 117.606c-4.539 0-8.23 3.691-8.23 8.227 0 4.539 3.691 8.23 8.23 8.23 4.536 0 8.227-3.691 8.227-8.23 0-4.536-3.691-8.227-8.227-8.227ZM249.75 117.606c-4.539 0-8.23 3.691-8.23 8.227 0 4.539 3.695 8.23 8.23 8.23 4.539 0 8.231-3.691 8.231-8.23 0-4.536-3.692-8.227-8.231-8.227Zm0 0"
    />
    <g clipPath="url(#b)" transform="translate(80.845 -37.715)">
      <path
        fill="currentColor"
        d="m161.344 225.164-5.961 2.727c7.601 6.437 17.406 10.351 28.125 10.351h13.144l51.153 23.399c1.058.492 2.406.254 3.25-.594a2.906 2.906 0 0 0 .57-3.266c-4.25-9.133-7.473-15.558-9.844-19.652l-.922-1.594 1.746-.59c17.774-5.968 29.72-22.605 29.72-41.402v-11.93c0-21.297-15.317-39.031-35.493-42.875a47.989 47.989 0 0 1 1.883 6.422.27.27 0 0 1 .031.012l-.035-.012a48.476 48.476 0 0 1 1.152 10.426v11.93c0 26.691-21.699 48.406-48.37 48.406H179.37m53.422 18.176"
      />
    </g>
  </svg>
)

export const BoardIcon = (props: props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    {...props}
  >
    <path
      fillRule="evenodd"
      stroke="transparent"
      d="M2 4.078C2 2.967 2.86 2 4 2h8c1.14 0 2 .967 2 2.078v6.393c0 1.111-.86 2.078-2 2.078H8.667v.04c0 1.11-.86 2.078-2 2.078H4c-1.14 0-2-.967-2-2.079v-8.51zm5.333-.745H4c-.333 0-.667.298-.667.745v8.51c0 .448.334.745.667.745h2.667c.332 0 .666-.297.666-.745V3.333zm1.334 0v7.883H12c.333 0 .667-.297.667-.745V4.078c0-.447-.334-.745-.667-.745H8.667z"
      clipRule="evenodd"
    />
  </svg>
);
export const WorkflowIcon = (props: props) => (
  <svg fill="currentColor" width={16} height={16} aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path d="M17.25 9h3a2.257 2.257 0 0 0 2.25-2.25v-3a2.257 2.257 0 0 0-2.25-2.25h-3A2.257 2.257 0 0 0 15 3.75v.75H9.3a4.122 4.122 0 0 0-4.05-3.375A4.132 4.132 0 0 0 1.125 5.25 4.122 4.122 0 0 0 4.5 9.3V15h-.75a2.257 2.257 0 0 0-2.25 2.25v3a2.257 2.257 0 0 0 2.25 2.25h3A2.257 2.257 0 0 0 9 20.25v-.75h10.95l-2.482 2.483A.747.747 0 0 0 18 23.257a.768.768 0 0 0 .532-.217l3.75-3.75a.749.749 0 0 0 .218-.532v-.008a.747.747 0 0 0-.255-.555l-3.728-3.728a.747.747 0 1 0-1.057 1.058L19.927 18H9v-.75A2.257 2.257 0 0 0 6.75 15H6V9.3A4.123 4.123 0 0 0 9.3 6H15v.75A2.257 2.257 0 0 0 17.25 9Zm-.75-5.25c0-.413.337-.75.75-.75h3c.413 0 .75.337.75.75v3c0 .412-.337.75-.75.75h-3a.752.752 0 0 1-.75-.75v-3ZM6.75 16.5c.412 0 .75.337.75.75v3c0 .413-.338.75-.75.75h-3a.752.752 0 0 1-.75-.75v-3c0-.413.337-.75.75-.75h3Zm-1.5-8.625A2.628 2.628 0 0 1 2.625 5.25 2.628 2.628 0 0 1 5.25 2.625 2.628 2.628 0 0 1 7.875 5.25 2.628 2.628 0 0 1 5.25 7.875Z" />
  </svg>
);