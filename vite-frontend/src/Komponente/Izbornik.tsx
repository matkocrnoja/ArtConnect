import { Avatar, Button, Menu, Text } from "@mantine/core";

interface Props {
   ime: string;
   avatar: string;
   onPostavke: () => void;
   onOdjava: () => void;
}

function KorisnickiIzbornik({
   ime, 
   avatar, 
   onPostavke,
   onOdjava
}: Props) {
   return (
      <Menu>
         <Menu.Target>
            <Button leftSection={<Avatar src={avatar}/>}>
               <Text>
                  {ime}
               </Text>
            </Button>
         </Menu.Target>

         <Menu.Dropdown>
            <Menu.Item onClick={onPostavke}>
               Postavke
            </Menu.Item>
            <Menu.Item onClick={onOdjava}>
               Odjava
            </Menu.Item>
         </Menu.Dropdown>
      </Menu>
   )
}

export default KorisnickiIzbornik;