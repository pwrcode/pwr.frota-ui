export default function PageTitle({title}: {title: string}) {
  return (
    <div className="w-full flex flex-row items-center">
      <h1 className="dark:text-foreground text-xl font-semibold md:text-2xl">{title}</h1>
    </div>
  )
}