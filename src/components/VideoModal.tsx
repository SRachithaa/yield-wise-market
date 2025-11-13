import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VideoModal = ({ open, onOpenChange }: VideoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Platform Demo - CropTrade in Action
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full aspect-video bg-black">
          {/* 
            To use your own demo video:
            1. Upload your video to YouTube and get the embed URL
            2. Replace the src URL below with: https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&rel=0
            
            Or use a direct video file:
            <video className="w-full h-full" controls autoPlay>
              <source src="/path-to-your-video.mp4" type="video/mp4" />
            </video>
          */}
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/fqVVOqnUhAA?start=0&rel=0"
            title="CropTrade Platform Demo - Smart Agriculture Technology"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <div className="p-6 pt-4 bg-muted/30">
          <h3 className="font-semibold text-foreground mb-2">What you'll see in this demo:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
              <span>How farmers list their crops on the bulk marketplace</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
              <span>Smart logistics matching system in action</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
              <span>AI-powered soil analysis and climate predictions</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
              <span>Real-time pricing and market insights</span>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
