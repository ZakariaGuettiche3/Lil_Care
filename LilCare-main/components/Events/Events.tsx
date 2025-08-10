"use client";
import { useSessionUser } from "@/lib/hooks";
import { EventData } from "@/types";
import React from "react";
import { SubscripeInService } from "@/server/payment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EventCardProps {
  event: EventData;
  subscriped?: (string | null)[];
}

const EventCard: React.FC<EventCardProps> = ({ event, subscriped }) => {
  const [isLoding, setIsLoding] = React.useState(false);
  const router = useRouter();
  const { currentUser } = useSessionUser();
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={event?.photo}
        alt={event?.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{event?.title}</h3>
        <p className="text-gray-700 mb-4">{event?.description}</p>
        {event?.metadata && (
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-medium mb-1">Schedule</h4>
              <p className="text-gray-600">
                Start:{" "}
                {new Date(event?.metadata?.schedule?.start)?.toLocaleString()}
              </p>
              <p className="text-gray-600">
                End:{" "}
                {new Date(event?.metadata?.schedule?.end)?.toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-1">Prices</h4>
              {event?.metadata?.prices?.map((price) => (
                <div key={price?.id} className="flex justify-between mb-1">
                  <span className="text-gray-600">{price?.type}:</span>
                  <span className="font-semibold">{price?.price} dz</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              {currentUser?.user_metadata?.role === "PARENT" && (
                <button
                  onClick={(e) => {
                    setIsLoding(true);
                    SubscripeInService({
                      price: event?.metadata?.prices?.at(0)!,
                      customer_id: currentUser.user_metadata.customerId,
                      successfullUrl: window.location.host
                    })
                      .then((res) => {
                        console.log(res);
                        
                        if (res) {
                          router.push(res.checkout_url);
                        }
                      })
                      .catch((err) => {
                        toast.error(err.message);
                        console.log(err);
                        
                      });
                    setIsLoding(false);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                >
                  {isLoding && <Loader2 className="animate-spin"/>}
                  {subscriped?.includes(currentUser?.id)
                    ? "Subscriped"
                    : "Subscripe"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
