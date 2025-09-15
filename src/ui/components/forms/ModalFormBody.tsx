
export default function ModalFormBody({ children }: any) {
    return (
        <div className="h-full overflow-y-auto rounded-md">
            <div className='flex flex-col gap-4 px-6 py-4 rounded-md'>
                {children}
            </div>
        </div>
    )
}
