import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Facebook, Instagram, Map, MapPinned, MessageCircle, Twitter } from 'lucide-react'
import {
  Calendar,
  ChevronRight,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useParams } from "react-router-dom"; // Assuming you're using React Router
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useEffect, useState } from "react";
import { db } from "./firebase"; // Assume you have Firebase initialized
import { SocialMediaInfo, UserProfile } from "@/lib/user-types";
import { dummyData } from "./dummy-data";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { allIcons } from "./icons";
import { UserProfileSkeleton } from "./Skeleton-data-loader";
import { useNavigate } from "react-router-dom";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
function base64ToImage(base64String: string): HTMLImageElement {
    const img = new Image();
    img.src = `data:image/png;base64,${base64String}`; // Set the src to the base64 string
    return img; // Return the Image element
  }


export default function ProfilePage() {
    const { toast } = useToast();


  const [isCopied, setIsCopied] = useState(false);

  
    const { profileId } = useParams<{ profileId: string }>();
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [profileImage, setProfileImage] = useState<HTMLImageElement | null>(
      null
    );
    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
    const [theme,setTheme]=useState<"light"|"dark">("light")
    const [isModalOpen, setIsModalOpen] = useState(false);

     useEffect(() => {
        if (profileId) {
          const profileRef = doc(db, "userInfo", profileId);
          getDoc(profileRef)
            .then((docSnapshot) => {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data() as UserProfile;
                setProfileData(data);
    
                if (data.additionalInfo.personal.background_image) {
                  setBgImage(
                    base64ToImage(data.additionalInfo.personal.background_image)
                  );
                }
                if (data.additionalInfo.personal.profile_image) {
                  setProfileImage(
                    base64ToImage(data.additionalInfo.personal.profile_image)
                  );
                }
                setTheme(data.additionalInfo.personal.theme);
              } else {
                setProfileData(dummyData);
              }
            })
            .catch(() => setProfileData(dummyData));
        }
      }, [profileId]);

 const handleImageClick = () => {
   setIsModalOpen(true);
 };

 const closeModal = () => {
   setIsModalOpen(false);
 };

      const handleCopy = () => {
    navigator.clipboard.writeText(`${profileData?.contactInfo.phoneNumber}`).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title:"Copied Successfully",
      }) // Reset after 2 seconds
    });
  };

  const paymentMethods = [
    {
      name: "gCash",
      icon: "fa-solid fa-money-bill",
      method: profileData?.paymentInfo.gCash,
    },
    {
      name: "payoneer",
      icon: "fa-solid fa-credit-card",
      method: profileData?.paymentInfo.payoneer,
    },
    {
      name: "paypal",
      icon: "fa-brands fa-paypal",
      method: profileData?.paymentInfo.paypal,
    },
    {
      name: "venmo",
      icon: "fa-brands fa-vimeo",
      method: profileData?.paymentInfo.venmo,
    },
    {
      name: "wise",
      icon: "fa-regular fa-credit-card",
      method: profileData?.paymentInfo.wise,
    },
    {
      name: "cryptocurrency",
      icon: "fa-brands fa-btc",
      method: profileData?.paymentInfo.cryptocurrency,
    },
    {
      name: "stripe",
      icon: "fa-brands fa-stripe",
      method: profileData?.paymentInfo.stripe,
    },
  ];

  const ecommerceMethods = [
    {
      name: "Amazon Store",
      icon: "fa-brands fa-amazon",
      method: profileData?.ecommerceInfo.amazonStore,
    },
    {
      name: "eBay Store",
      icon: "fa-brands fa-ebay",
      method: profileData?.ecommerceInfo.ebay,
    },
    {
      name: "Shopee Store",
      icon: "fa-solid fa-store",
      method: profileData?.ecommerceInfo.shopee,
    },
    {
      name: "Shopify Store",
      icon: "fa-brands fa-shopify",
      method: profileData?.ecommerceInfo.shopifyStore,
    },
    {
      name: "Lazada Store",
      icon: "fa-solid fa-store",
      method: profileData?.ecommerceInfo.lazada,
    },
    {
      name: "Etsy Store",
      icon: "fa-brands fa-etsy",
      method: profileData?.ecommerceInfo.etsy,
    },
  ];

  const additionalMethods = [
    {
      name: "File Sharing",
      icon: "fa-solid fa-cloud-upload-alt", // Icon for file sharing
      method: profileData?.additionalInfo.fileSharing,
    },
    {
      name: "Blog",
      icon: "fa-solid fa-pencil-alt", // Icon for blog
      method: profileData?.additionalInfo.blog,
    },
    {
      name: "Resume",
      icon: "fa-solid fa-file-alt", // Icon for resume
      method: profileData?.additionalInfo.resume,
    },
    {
      name: "Custom Landing",
      icon: "fa-solid fa-laptop-code", // Icon for custom landing page
      method: profileData?.additionalInfo.customLanding,
    },
    {
      name: "Event",
      icon: "fa-solid fa-calendar-alt", // Icon for event
      method: profileData?.additionalInfo.event,
    },
    {
      name: "Personal Website",
      icon: "fa-solid fa-globe", // Icon for event
      method: profileData?.additionalInfo.website_link,
    },
  ];


    const socialMediaIcons: Record<keyof SocialMediaInfo, string> = {
      pinterest: "fab fa-pinterest",
      youtube: "fab fa-youtube",
      snapchat: "fab fa-snapchat",
      twitter: "fab fa-twitter",
      upwork: "fab fa-upwork",
      appleMusic: "fab fa-apple",
      amazon: "fab fa-amazon",
      facebook: "fab fa-facebook",
      substack: "fab fa-stack-overflow",
      instagram: "fab fa-instagram",
      spotify: "fab fa-spotify",
      soundCloud: "fab fa-soundcloud",
      medium: "fab fa-medium",
      dribble: "fab fa-dribbble",
      fiver: "fa-solid fa-link",
      github: "fab fa-github",
      linkedin: "fab fa-linkedin",
      behance: "fab fa-behance",
      tiktok: "fab fa-tiktok",
      freelancer: "fas fa-user-tie", // Font Awesome doesn't have a Freelancer icon, so this is a placeholder.
    };
if (!profileData) {
  return (
    <div>
      <UserProfileSkeleton />
    </div>
  ); // Loading state while data is being fetched
}


const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "#1877F2"; // Facebook Blue
      case "twitter":
        return "#1DA1F2"; // Twitter Blue
      case "instagram":
        return "#C13584"; // Instagram Pink
      case "linkedin":
        return "#0A66C2"; // LinkedIn Blue
      case "youtube":
        return "#FF0000"; // YouTube Red
      case "pinterest":
        return "#E60023"; // Pinterest Red
      case "snapchat":
        return "#FFFC00"; // Snapchat Yellow
      case "upwork":
        return "#006ED4"; // Upwork Blue
      case "applemusic":
        return "#FE7423"; // Apple Music Orange
      case "amazon":
        return "#FF9900"; // Amazon Orange
      case "substack":
        return "#F37C30"; // Substack Orange
      case "spotify":
        return "#1DB954"; // Spotify Green
      case "soundcloud":
        return "#FF5500"; // SoundCloud Orange
      case "medium":
        return "#00AB6B"; // Medium Green
      case "dribble":
        return "#EA4C89"; // Dribbble Pink
      case "fiver":
        return "#00AEEF"; // Fiverr Blue
      case "github":
        return "#181717"; // GitHub Black
      case "linkedin":
        return "#0A66C2"; // LinkedIn Blue
      case "behance":
        return "#1769FF"; // Behance Blue
      case "tiktok":
        return "#69C9D0"; // TikTok Teal
      case "freelancer":
        return "#009EE3"; // Freelancer Blue
      default:
        return "#FFFFFF"; // Default White
    }
  };
  return (
    <div className="flex flex-col justify-center items-center m-3">
      <Card
        style={{
          backgroundImage: `url(${
            bgImage
              ? bgImage.src
              : dummyData.additionalInfo.personal.background_image
          })`,
          backgroundSize: "cover", // Ensures the image fits within the card without stretching
          backgroundPosition: "center", // Centers the image
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat", // Ensures no repeat of background image
          backgroundColor: "#2C5364", // Background color beneath the image
          backdropFilter: "blur(8px)", // Increases blur intensity for the content
        }}
        className="border border-white rounded-lg shadow-md"
      >
        <div className="w-fit  px-4 py-8 flex flex-col items-center justify-center space-y-6">
          {/* Profile Image */}
          <Avatar
            className={`w-56 h-56 border-4 ${
              theme == "light" ? "border-black" : "border-white"
            }`}
          >
            <AvatarImage
              src={
                profileImage?.src ||
                dummyData.additionalInfo.personal.profile_image
              }
              alt="Profile Picture"
              onClick={handleImageClick} // Open image in modal when clicked
            />
            <AvatarFallback>PF</AvatarFallback>
          </Avatar>

          {/* Social Media Icons */}
          <div className="overflow-x-auto scrollbar-hide w-[350px]">
            <div className="flex space-x-6">
              {Object.entries(profileData?.socialMediaInfo || {}).map(
                ([key, link]) => {
                  if (!link) return null;

                  const iconClass =
                    socialMediaIcons[key as keyof SocialMediaInfo];

                  return (
                    <a
                      key={key}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white flex justify-center items-center hover:text-gray-300"
                    >
                      <div
                        className={`w-12 h-12 rounded-full border-2 ${
                          theme === "light" ? "border-black" : "border-white"
                        } flex items-center justify-center`}
                      >
                        <i
                          style={{ color: getPlatformColor(key) }}
                          className={`${iconClass} text-center  text-2xl w-full h-full flex items-center justify-center ${
                            theme === "light" ? "text-black" : "text-white"
                          }`}
                        ></i>
                      </div>
                    </a>
                  );
                }
              )}
            </div>
          </div>

          {/* Bio Card */}
          <Card
            className={`w-full max-w-md
            ${
              theme == "light"
                ? "border-black bg-white/50"
                : "border-white bg-black/50"
            }
             border  backdrop-blur-sm p-4 rounded-3xl 
             
             `}
          >
            <h1
              className={` ${
                theme == "light" ? "text-black" : "text-white"
              } text-2xl font-bold text-center mb-1`}
              style={{
                fontSize: `${
                  profileData?.additionalInfo.personal.font_size ||
                  dummyData.additionalInfo.personal.font_size
                }px`,
                fontFamily:
                  profileData?.additionalInfo.personal.font_family ||
                  dummyData.additionalInfo.personal.font_family,
              }}
            >
              {profileData?.additionalInfo.personal.fullname || "Name"}
            </h1>
            <h1
              className={` text-2xl font-bold text-center mb-2
              ${theme == "light" ? "text-black" : "text-white"}
              `}
              style={{
                fontSize: `${
                  profileData?.additionalInfo.personal.font_size ||
                  dummyData.additionalInfo.personal.font_size
                }px`,
                fontFamily:
                  profileData?.additionalInfo.personal.font_family ||
                  dummyData.additionalInfo.personal.font_family,
              }}
            >
              {profileData?.additionalInfo.personal.designation ||
                "Designation"}
            </h1>
            <p
              className={`${
                theme == "light" ? "text-black/90" : "text-white/90"
              } 
            text-center`}
              style={{
                fontSize: `${
                  profileData?.additionalInfo.personal.font_size ||
                  dummyData.additionalInfo.personal.font_size
                }px`,
                fontFamily:
                  profileData?.additionalInfo.personal.font_family ||
                  dummyData.additionalInfo.personal.font_family,
              }}
            >
              {profileData?.additionalInfo.personal.description ||
                "Description here"}
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-4 h-52 overflow-y-auto scrollbar-hide">
            {profileData?.contactInfo.email && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `mailto:${profileData?.contactInfo.email}`,
                    "_blank"
                  )
                }
                className={`w-full h-14 
    ${
      theme === "light"
        ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
        : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
    }
    backdrop-blur-sm rounded-2xl`}
                style={{
                  fontSize: `${
                    profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                  }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
              >
                <i
                  className={`fa-solid fa-envelope text-2xl
                  ${theme === "light" ? "text-black" : "text-white"}
                  `}
                ></i>

                {profileData?.contactInfo.email}
              </Button>
            )}

            {profileData?.contactInfo.whatsapp && (
              <Button
                variant="outline"
                onClick={() => {
                  window.open(
                    `https://wa.me/${profileData?.contactInfo.phoneNumber}`,
                    "_blank"
                  );
                }}
                className={`w-full h-14
                
                ${
                  theme == "light"
                    ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white "
                    : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
                }
                   backdrop-blur-sm 
                   
                    rounded-2xl`}
                style={{
                  fontSize: `${
                    profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                  }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
              >
                <i
                  className={`text-2xl fa-brands fa-whatsapp ${
                    theme == "light"
                      ? "text-black hover:text-white"
                      : "text-white hover:text-black"
                  }`}
                />
                {profileData?.contactInfo.whatsapp}
              </Button>
            )}

            {profileData?.contactInfo.phoneNumber && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${
                    profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                  }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  handleCopy();
                }}
                className={`w-full h-14 
    ${
      theme === "light"
        ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
        : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
    }
    backdrop-blur-sm rounded-2xl`}
              >
                <i
                  className={`text-2xl fa-solid fa-phone ${
                    theme == "light"
                      ? "text-black hover:text-white"
                      : "text-white hover:text-black"
                  }`}
                />
                {profileData?.contactInfo.phoneNumber}
              </Button>
            )}

            {profileData?.contactInfo.skype && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${
                    profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                  }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(`${profileData?.contactInfo.skype}`, "_blank");
                }}
                className={`w-full h-14
          ${
            theme === "light"
              ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
              : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
          } backdrop-blur-sm rounded-2xl`}
              >
                <i
                  className={`text-2xl fa-brands fa-skype ${
                    theme === "light"
                      ? "text-black hover:text-white"
                      : "text-white hover:text-black"
                  }`}
                />
                Skype
              </Button>
            )}

            {/* Zoom Button */}
            {profileData?.contactInfo.zoom && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${
                    profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                  }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(profileData?.contactInfo.zoom, "_blank");
                }}
                className={`w-full h-14
          ${
            theme === "light"
              ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
              : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
          } backdrop-blur-sm rounded-2xl`}
              >
                <i
                  className={`text-2xl fa-solid fa-video ${
                    theme === "light"
                      ? "text-black hover:text-white"
                      : "text-white hover:text-black"
                  }`}
                />
                Zoom
              </Button>
            )}

            {/* Telegram Button */}
            {profileData?.contactInfo.telegram && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${
                    profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                  }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    `${
                      profileData.contactInfo.telegram.startsWith(
                        "https://t.me/"
                      )
                        ? profileData.contactInfo.telegram
                        : "https://t.me/" + profileData.contactInfo.telegram
                    }`,
                    "_blank"
                  );
                }}
                className={`w-full h-14
          ${
            theme === "light"
              ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
              : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
          } backdrop-blur-sm rounded-2xl`}
              >
                <i
                  className={`text-2xl fa-brands fa-telegram ${
                    theme === "light"
                      ? "text-black hover:text-white"
                      : "text-white hover:text-black"
                  }`}
                />
                Telegram
              </Button>
            )}

            {/* Google Meet Button */}
            {profileData?.contactInfo.googleMeet && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${
                    profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                  }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.contactInfo.googleMeet as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14
          ${
            theme === "light"
              ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
              : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
          } backdrop-blur-sm rounded-2xl`}
              >
                <i
                  className={`text-2xl fa-solid fa-video ${
                    theme === "light"
                      ? "text-black hover:text-white"
                      : "text-white hover:text-black"
                  }`}
                />
                Google Meet
              </Button>
            )}

            {/* Calendar Button */}
            {profileData?.contactInfo.calender && (
              <Button
                variant="outline"
                style={{
                  fontSize: `${
                    profileData?.additionalInfo.personal.font_size ||
                    dummyData.additionalInfo.personal.font_size
                  }px`,
                  fontFamily:
                    profileData?.additionalInfo.personal.font_family ||
                    dummyData.additionalInfo.personal.font_family,
                }}
                onClick={() => {
                  window.open(
                    profileData?.contactInfo.calender as string,
                    "_blank"
                  );
                }}
                className={`w-full h-14
          ${
            theme === "light"
              ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
              : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
          } backdrop-blur-sm rounded-2xl`}
              >
                <i
                  className={`text-2xl fa-regular fa-calendar ${
                    theme === "light"
                      ? "text-black hover:text-white"
                      : "text-white hover:text-black"
                  }`}
                />
                Calendar
              </Button>
            )}

            {paymentMethods.map(
              ({ name, icon, method }) =>
                method &&
                method !== null &&
                method.length > 0 && (
                  <Button
                    key={name}
                    variant="outline"
                    style={{
                      fontSize: `${
                        profileData?.additionalInfo.personal.font_size ||
                        dummyData.additionalInfo.personal.font_size
                      }px`,
                      fontFamily:
                        profileData?.additionalInfo.personal.font_family ||
                        dummyData.additionalInfo.personal.font_family,
                    }}
                    onClick={() => {
                      const url = `${method}`;
                      window.open(url, "_blank");
                    }}
                    className={`w-full h-14 ${
                      theme === "light"
                        ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
                        : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
                    } backdrop-blur-sm rounded-2xl flex justify-center items-center`}
                  >
                    <div className="w-8 h-8 text-xl capitalize mr-2 flex justify-center items-center">
                      <i
                        className={`${icon} text-2xl ${
                          theme === "light" ? "text-black" : "text-white"
                        }`}
                      />
                    </div>
                    {name}
                  </Button>
                )
            )}

            {ecommerceMethods.map(
              ({ name, icon, method }) =>
                method &&
                method !== null &&
                method.length > 0 && (
                  <Button
                    key={name}
                    variant="outline"
                    style={{
                      fontSize: `${
                        profileData?.additionalInfo.personal.font_size ||
                        dummyData.additionalInfo.personal.font_size
                      }px`,
                      fontFamily:
                        profileData?.additionalInfo.personal.font_family ||
                        dummyData.additionalInfo.personal.font_family,
                    }}
                    onClick={() => {
                      const url = `${method}`;
                      window.open(url, "_blank");
                    }}
                    className={`w-full h-14 ${
                      theme === "light"
                        ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
                        : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
                    } backdrop-blur-sm rounded-2xl flex justify-center items-center`}
                  >
                    <div className="w-8 h-8 text-xl capitalize mr-2 flex justify-center items-center">
                      <i
                        className={`${icon} text-2xl ${
                          theme === "light" ? "text-black" : "text-white"
                        }`}
                      />
                    </div>
                    {name}
                  </Button>
                )
            )}

            {additionalMethods.map(
              ({ name, icon, method }) =>
                method &&
                method !== null &&
                method.length > 0 && (
                  <Button
                    key={name}
                    variant="outline"
                    onClick={() => {
                      const url = method;
                      window.open(url, "_blank");
                    }}
                    style={{
                      fontSize: `${
                        profileData?.additionalInfo.personal.font_size ||
                        dummyData.additionalInfo.personal.font_size
                      }px`,
                      fontFamily:
                        profileData?.additionalInfo.personal.font_family ||
                        dummyData.additionalInfo.personal.font_family,
                    }}
                    className={`w-full h-14 ${
                      theme === "light"
                        ? "text-black bg-white/50 border-black hover:bg-black/10 hover:text-white"
                        : "text-white bg-black/50 border-white hover:bg-white/10 hover:text-black"
                    } backdrop-blur-sm rounded-2xl flex justify-center items-center`}
                  >
                    <div className="w-8 h-8 text-2xl capitalize mr-2 flex justify-center items-center">
                      <i
                        className={`${icon} text-xl ${
                          theme === "light" ? "text-black" : "text-white"
                        }`}
                      />
                    </div>
                    {name}
                  </Button>
                )
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-white/80 mt-8 space-y-2">
            <h2 className="font-semibold text-center flex justify-center items-center">
              <MapPinned
                className={`w-8 h-8 ${
                  theme == "light" ? "text-black" : "text-white"
                }`}
              />
            </h2>
            <p
              style={{
                fontSize: `${
                  profileData?.additionalInfo.personal.font_size ||
                  dummyData.additionalInfo.personal.font_size
                }px`,
                fontFamily:
                  profileData?.additionalInfo.personal.font_family ||
                  dummyData.additionalInfo.personal.font_family,
              }}
              onClick={() => {
                window.open(`${profileData?.contactInfo.maplink}`, "_blank");
              }}
              className={`text-sm
              ${theme == "light" ? "text-black" : "text-white"}
              max-w-md`}
            >
              {profileData?.contactInfo.physicalAddress}
            </p>
          </div>
        </div>
      </Card>
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={closeModal} // Close modal when clicked outside
        >
          <img
            src={
              profileImage?.src ||
              dummyData.additionalInfo.personal.profile_image
            }
            alt="Profile Preview"
            style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
}

