import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";

const images = Object.values(
  import.meta.glob("../../assets/*.{jpg,png}", { eager: true })
).map((mod: any) => mod.default);


export default function RadixCarousel() {
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);


  return (
    <Tabs.Root value={String(activeIndex)} onValueChange={(val) => setActiveIndex(Number(val))} className="w-full">
      {images.map((image, index) => (
        <Tabs.Content
          key={index}
          value={String(index)}
          className="relative isolate overflow-hidden h-[45vh] min-h-[300px] max-h-[620px]"
        >
           <div
            className="absolute inset-0 blur-2xl opacity-40"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="h-full w-full object-contain"
          />
        </Tabs.Content>
      ))}
      <Tabs.List className="flex justify-center space-x-2 mt-4">
        {images.map((image, index) => (
          <Tabs.Trigger
            key={index}
            value={String(index)}
            className="w-3 h-3 rounded-full bg-gray-300 data-[state=active]:bg-blue-500"
          >
            <img src={image} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
