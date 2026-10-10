import { FaReact, FaLanguage } from "react-icons/fa";
import { TbBrandCpp, TbBrandCSharp } from "react-icons/tb";
import { SiExpo, SiP5Dotjs, SiAseprite, SiUnity, SiGooglecardboard, SiSupabase, SiLatex, SiFigma, SiRive, SiMapbox, SiOpengl, SiNodedotjs, SiJavascript, SiAffinitydesigner, SiWordpress, SiBlender, SiDavinciresolve } from "react-icons/si";
import React from "react";

// shared by the info panel and the projects list
export const iconMap: Record<string, React.ReactElement> = {
    React: <FaReact size={30} />,
    Expo: <SiExpo size={30} />,
    P5: <SiP5Dotjs size={30} />,
    Unity: <SiUnity size={30} />,
    Cardboard: <SiGooglecardboard size={30} />,
    Supabase: <SiSupabase size={30} />,
    Latex: <SiLatex size={30} />,
    Figma: <SiFigma size={30} />,
    Rive: <SiRive size={30} />,
    Mapbox: <SiMapbox size={30} />,
    OpenGL: <SiOpengl size={30} />,
    CPP: <TbBrandCpp size={30} />,
    CSharp: <TbBrandCSharp size={30} />,
    Aseprite: <SiAseprite size={30} />,
    NodeDotJs: <SiNodedotjs size={30} />,
    Javascript: <SiJavascript size={30} />,
    Language: <FaLanguage size={30} />,
    AffinityDesigner: <SiAffinitydesigner size={30} />,
    Wordpress: <SiWordpress size={30} />,
    Blender: <SiBlender size={30} />,
    Resolve: <SiDavinciresolve size={30} />,
};
