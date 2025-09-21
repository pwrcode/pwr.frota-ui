type paramsType = {
    children: React.ReactNode,
    style?: string
}

export default function ModalFormFooter({children, style}: paramsType) {
    return (
        <div className={style ? style : `flex flex-col w-full dark:bg-accent rounded-b-lg bg-muted/50`}>
            <hr />
            <div className='flex flex-row justify-end gap-2 p-4 w-full'>
                {children}
            </div>
        </div>
    )
}
