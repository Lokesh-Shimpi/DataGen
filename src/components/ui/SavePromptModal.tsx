/**
 * SavePromptModal Component
 * =========================
 * Prompts unauthenticated users to sign up/login to save their work.
 */

import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/Modal';

interface SavePromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType?: string; // e.g., "dataset" or "analysis"
}

export function SavePromptModal({ 
  open, 
  onOpenChange, 
  itemType = 'work' 
}: SavePromptModalProps) {
  const navigate = useNavigate();

  const handleSignup = () => {
    onOpenChange(false);
    navigate('/signup', { state: { returnTo: window.location.pathname } });
  };

  const handleLogin = () => {
    onOpenChange(false);
    navigate('/login', { state: { returnTo: window.location.pathname } });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Save className="h-6 w-6 text-primary" />
          </div>
          <ModalTitle className="text-center">Save Your {itemType}</ModalTitle>
          <ModalDescription className="text-center">
            Create a free account to save your {itemType} and access it anytime from your dashboard.
          </ModalDescription>
        </ModalHeader>
        
        <div className="space-y-3 py-4">
          <Button 
            onClick={handleSignup} 
            className="w-full gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Sign Up Free
          </Button>
          
          <Button 
            onClick={handleLogin} 
            variant="outline" 
            className="w-full gap-2"
          >
            <LogIn className="h-4 w-4" />
            Already have an account? Log in
          </Button>
        </div>

        <ModalFooter className="justify-center border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            You can still download your {itemType} without an account
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SavePromptModal;
