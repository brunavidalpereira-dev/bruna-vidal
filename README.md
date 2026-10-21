# Portfólio Bruna Vidal

Site de portfólio de Bruna Vidal, Head de Digital & Influência.

Todo o conteúdo do site (textos, números, cases, projetos, marcas, fotos e contato) fica em um único arquivo, `content/site.json`. Para editar, use o editor visual descrito abaixo. Você não precisa mexer em código.

## Como editar o site

1. Acesse **app.pagescms.org** e clique em entrar com o GitHub.
2. Na primeira vez, o Pages CMS pede autorização para acessar sua conta. Quando perguntar quais repositórios liberar, escolha só este.
3. Abra este repositório e clique em **Conteúdo do site**.
4. Edite o que quiser e clique em **Save**.
5. Espere cerca de um minuto e recarregue o site.

## O que dá para fazer pelo editor

- **Big numbers:** troque número, unidade e legenda. Desmarque **Publicar** para esconder um número sem apagá-lo.
- **Cases em destaque:** edite os textos, a ficha técnica e o número de destaque. Arraste os itens para mudar a ordem no site.
- **Capa dos cases:** enquanto não houver imagem, o site mostra uma capa tipográfica. Ao enviar uma **Imagem de capa**, ela substitui a capa tipográfica.
- **Galeria:** até seis imagens por case. Se ficar vazia, a seção não aparece.
- **Rostos da capa:** no estilo de capa claro, cada quadro pode receber a foto de um influenciador.
- **Vídeos:** cases e projetos aceitam um link do Google Drive, YouTube ou Vimeo. No Drive, o vídeo precisa estar compartilhado como "Qualquer pessoa com o link", senão o player aparece bloqueado para os visitantes.
- **Outros projetos:** um texto por projeto, com imagem e vídeo opcionais. Projetos sem texto, imagem ou vídeo aparecem na lista, mas não abrem.
- **Marcas:** ao enviar um logotipo, ele substitui o nome escrito.
- **Página Sobre:** foto, texto de abertura, trajetória, competências, formação e idiomas.
- **Contato:** e-mail, localização e LinkedIn. O LinkedIn só aparece se estiver preenchido.

Campos vazios não aparecem no site. Para tirar alguma informação, basta apagar o texto.

## Imagens

- Use apenas imagens com autorização de uso.
- Formatos: JPG, PNG ou WebP. Para logotipos, prefira PNG com fundo transparente.
- Proporções recomendadas: foto profissional 4:5 (vertical), capa de case 16:10, galeria 4:5.
- Tente manter cada arquivo abaixo de 1 MB. Imagens grandes deixam o site lento.

## Se algo der errado

Cada vez que você salva, o GitHub guarda uma versão. Para voltar atrás, abra o arquivo `content/site.json` no GitHub, clique em **History** e veja o que mudou.

O layout (posição das seções, cores e tipografia) não é editável pelo editor. Mudanças de layout exigem alterar os arquivos da pasta `assets`.

## Estrutura

- `index.html`: página base.
- `assets/`: estilo (`style.css`), montagem das páginas (`app.js`) e ícone.
- `content/site.json`: todo o conteúdo.
- `images/`: imagens enviadas pelo editor.
- `.pages.yml`: configuração dos formulários do editor.
