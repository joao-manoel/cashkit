import { BBIcon, DefaultCardIcon } from './icons'
import NubankBagdeIcon from './icons/badges/nubank-bagde-icon'

export const CardIcon = (icon: string) => {
  switch (icon) {
    case 'NUBANK':
      return <NubankBagdeIcon />
    case 'BB':
      return <BBIcon />
    default:
      return <DefaultCardIcon />
  }
}
