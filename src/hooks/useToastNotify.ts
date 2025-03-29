import { toast } from 'sonner'

export const useToastNotify = () => {
  const success = (message: string, actionLabel?: string, onAction?: () => void) => {
    toast.success(message, {
      icon: '✅',
      ...(actionLabel && onAction
        ? {
            action: {
              label: actionLabel,
              onClick: onAction,
            },
          }
        : {}),
    })
  }

  const error = (message: string) => {
    toast.error(message, {
      icon: '⚠️',
    })
  }

  return { success, error }
}