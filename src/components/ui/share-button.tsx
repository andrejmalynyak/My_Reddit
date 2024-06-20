import { Button, ButtonProps } from "./button";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./dialog";

export interface ShareButtonProps
  extends ButtonProps,
    VariantProps<typeof buttonVariants> {
  title: string;
  shareUrl: string;
  shareDialog?: React.ReactNode;
}

const ShareButton = React.forwardRef<HTMLButtonElement, ShareButtonProps>(
  ({ title, shareUrl, ...props }, ref) => {
    const share = () => {
      if (navigator.share) {
        navigator.share({ title, url: shareUrl });
      } else {
        navigator.clipboard.writeText(shareUrl);
      }
    };

    // This function in fact is not always declared - it exists on mobile devices,
    // but not on desktops. We need to silence typescript:
    // @ts-ignore
    return navigator.share ? (
      <Button ref={ref} onClick={share} {...props} />
    ) : (
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={ref} {...props} />
        </DialogTrigger>
        <DialogContent>
          {props.shareDialog || (
            <>
              <DialogHeader>Share</DialogHeader>
              <DialogDescription>{title}</DialogDescription>
              <div className="flex space-around p-2 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="bg-transparent w-full focus-visible:outline-none"
                />
                <Button variant="secondary" onClick={share}>
                  Copy Link
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);
ShareButton.displayName = "ShareButton";

export { ShareButton };
