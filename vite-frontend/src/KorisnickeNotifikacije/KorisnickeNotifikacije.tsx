
import classes from './KorisnickeNotifikacije.module.css';
import { notifications } from '@mantine/notifications'
import { IconCheck, IconExclamationCircle, IconX, type ReactNode } from "@tabler/icons-react"

// Ovo je iz mog jednog prijašnjeg projekta, služi kao generalni utility

export function showQuickInfo(text: string, icon?: ReactNode, color?: string) {
    notifications.show({
        title: 'Obavijest',
        message: text,
        icon: icon || <IconExclamationCircle />,
        color: color || "blue",
        withCloseButton: true,
        autoClose: 5000,
        classNames: classes
    })
}

export function showHint(text: string, persist?: boolean){
    notifications.show({
        title: 'Hej!',
        message: text,
        icon: <IconExclamationCircle />,
        color: "blue",
        withCloseButton: true,
        autoClose: persist ? false : 5000,
        classNames: classes
    })
}

export function showLoading(text: string, id: string){
    notifications.show({
        title: 'Pričekajte...',
        message: text,
        id: id,
        loading: true,
        withCloseButton: false,
        autoClose: false,
        classNames: classes
    })
}

// directTo = funkcija koja prima samo tekst, npr. showSuccess, showError, showWarning
export function updateLoading(id: string, text: string, directTo: (text: string) => void){
    notifications.update({message: "Učitano.", id: id, autoClose: 1})
    directTo(text)
}

export function showSuccess(text: string){
    notifications.show({
        title: 'Uspjeh!',
        message: text,
        icon: <IconCheck />,
        color: "teal",
        withCloseButton: true,
        classNames: classes
    })
}

export function showWarning(text: string){
    notifications.show({
        title: "Upozorenje!",
        message: text,
        icon: <IconExclamationCircle/>,
        color: "red",
        withCloseButton: true,
        autoClose: false,
        classNames: classes
    })
}

export function showError(text: string | null){
    notifications.show({
        title: 'Došlo je do problema!',
        message: text,
        icon: <IconX />,
        color: "red",
        withCloseButton: false,
        classNames: classes,
        position: 'bottom-right',
    })
}