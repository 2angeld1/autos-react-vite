import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { clsx } from '@/utils/clsx';
import Button from './Button';

export interface WizardStep {
  id: number;
  title: string;
  description?: string;
  icon: LucideIcon;
}

interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
  onSubmit: () => void;
  canNext?: () => Promise<boolean> | boolean;
  loading?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
  accentColor?: 'sky' | 'indigo' | 'primary';
}

const Wizard: React.FC<WizardProps> = ({
  steps,
  currentStep,
  onStepChange,
  onClose,
  onSubmit,
  canNext,
  loading,
  submitLabel = 'Finalizar',
  children,
  accentColor = 'sky'
}) => {
  const btnColorMap = {
    sky: '!bg-sky-600 hover:!bg-sky-700',
    indigo: '!bg-indigo-600 hover:!bg-indigo-700',
    primary: '!bg-primary-700 hover:!bg-primary-800 shadow-primary-700/20'
  };

  const handleNext = async () => {
    if (canNext) {
      const isValid = await canNext();
      if (!isValid) return;
    }
    onStepChange(Math.min(currentStep + 1, steps.length));
  };

  const handlePrev = () => {
    onStepChange(Math.max(currentStep - 1, 1));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Header */}
      <div className="px-1 mb-10">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
          <motion.div 
            className={clsx("absolute top-1/2 left-0 h-0.5 -translate-y-1/2 z-0", 
              accentColor === 'sky' ? 'bg-sky-500' : accentColor === 'indigo' ? 'bg-indigo-500' : 'bg-primary-500'
            )}
            initial={false}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div 
                  className={clsx(
                    "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    isActive ? `bg-white dark:bg-gray-800 shadow-lg border-current` : 
                    isCompleted ? "text-white border-transparent" : 
                    "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
                  )}
                  style={isActive ? { borderColor: accentColor === 'sky' ? '#0ea5e9' : accentColor === 'indigo' ? '#6366f1' : '#4338ca' } : {}}
                  animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                >
                  {isCompleted ? (
                    <div className={clsx("w-full h-full rounded-full flex items-center justify-center", 
                      accentColor === 'sky' ? 'bg-sky-500' : accentColor === 'indigo' ? 'bg-indigo-500' : 'bg-primary-500'
                    )}>
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <Icon className={clsx("h-5 w-5", isActive && (accentColor === 'sky' ? 'text-sky-500' : accentColor === 'indigo' ? 'text-indigo-500' : 'text-primary-500'))} />
                  )}
                </motion.div>
                <span className={clsx(
                  "absolute top-12 text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap",
                  isActive ? (accentColor === 'sky' ? 'text-sky-600' : accentColor === 'indigo' ? 'text-indigo-600' : 'text-primary-700') : "text-gray-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-1 min-h-[350px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-8 mt-6 border-t border-gray-100 dark:border-gray-700">
        <Button 
          variant="ghost" 
          onClick={currentStep === 1 ? onClose : handlePrev} 
          icon={currentStep === 1 ? undefined : <ChevronLeft className="h-4 w-4" />}
          disabled={loading}
        >
          {currentStep === 1 ? 'Cancelar' : 'Anterior'}
        </Button>

        {currentStep < steps.length ? (
          <Button 
            variant="primary" 
            onClick={handleNext} 
            icon={<ChevronRight className="h-4 w-4" />}
            className={clsx(btnColorMap[accentColor], "px-8")}
            disabled={loading}
          >
            Siguiente
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={onSubmit}
            loading={loading} 
            icon={<Check className="h-4 w-4" />} 
            className={clsx(btnColorMap[accentColor === 'sky' || accentColor === 'indigo' ? 'primary' : 'primary'], "px-8 shadow-lg")}
          >
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Wizard;
