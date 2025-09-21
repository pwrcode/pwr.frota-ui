import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type propsType = {
  title: string,
  content: string | number | undefined,
  children?: React.ReactNode,
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'teal'
}

export const CardSingle = ({title, content, children, variant = 'default'}: propsType) => {

  const classes = getVariantClasses(variant);

  return (
    <Card className={`${classes.card} transition-all duration-200 hover:scale-105 hover:shadow-xl`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className={`text-sm font-medium flex-1 ${classes.title}`}>
          {title}
        </CardTitle>
        {children && (
          <div className={`p-2 rounded-lg ${classes.icon}`}>
            {children}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={`text-2xl font-bold ${classes.content}`}>
          {content && content}
        </div>
      </CardContent>
    </Card>
  )
}

export const getVariantClasses = (variant: string) => {
  switch (variant) {
    case 'primary':
      return {
        card: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-300 shadow-lg shadow-blue-500/25',
        icon: 'bg-white/20 text-white',
        title: 'text-blue-100',
        content: 'text-white'
      };
    case 'success':
      return {
        card: 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-300 shadow-lg shadow-green-500/25',
        icon: 'bg-white/20 text-white',
        title: 'text-green-100',
        content: 'text-white'
      };
    case 'warning':
      return {
        card: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-300 shadow-lg shadow-orange-500/25',
        icon: 'bg-white/20 text-white',
        title: 'text-orange-100',
        content: 'text-white'
      };
    case 'info':
      return {
        card: 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-cyan-300 shadow-lg shadow-cyan-500/25',
        icon: 'bg-white/20 text-white',
        title: 'text-cyan-100',
        content: 'text-white'
      };
    case 'secondary':
      return {
        card: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-300 shadow-lg shadow-purple-500/25',
        icon: 'bg-white/20 text-white',
        title: 'text-purple-100',
        content: 'text-white'
      };
    case 'teal':
      return {
        card: 'bg-gradient-to-br from-teal-500 to-teal-600 text-white border-teal-300 shadow-lg shadow-teal-500/25',
        icon: 'bg-white/20 text-white',
        title: 'text-teal-100',
        content: 'text-white'
      };
    default:
      return {
        card: 'bg-card border-gray-200 dark:border-border shadow-md',
        icon: 'bg-gray-100 dark:bg-accent text-gray-600 dark:text-gray-300',
        title: 'text-gray-600 dark:text-gray-300',
        content: 'text-gray-900 dark:text-foreground'
      };
  }
};