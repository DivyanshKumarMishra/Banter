import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Modal({ children, open = false, closeModal = () => {}, setSelectedContacts = () => {}, className = '', backdropClasses = '', imageModal = false, childrenClasses = '' }) {
  
  return (
    <Dialog open={open} onClose={closeModal} className="relative z-80">
      <DialogBackdrop
        transition
        className={`fixed inset-0 z-90 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in ${backdropClasses}`} />
        <div className="fixed inset-0 z-100 w-screen overflow-y-auto">
          <div className="flex h-full min-h-full justify-center p-4 text-center items-center sm:p-0">
            <DialogPanel
              transition
              className={`relative transform overflow-hidden rounded-lg px-4 py-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 ${className}`}>
                {!imageModal && <button
                  onClick={() => {
                    closeModal()
                    setSelectedContacts && setSelectedContacts([])
                  }}
                  className="absolute top-2 right-2 p-1 text-primary hover:text-white hover:bg-primary rounded-full"
                  aria-label="Close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>}
                <div className={`${childrenClasses}`}>
                  {children}
                </div>
            </DialogPanel>
          </div>
        </div>
    </Dialog>
  )
}