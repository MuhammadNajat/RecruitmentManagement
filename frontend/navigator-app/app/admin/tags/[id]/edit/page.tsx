import { getTagByID } from '@/app/lib/data/tags/queries/readTagAction'
import { Tag } from "@/app/lib/definitions";
import Breadcrumbs from "@/app/ui/breadcrumbs"
import EditTagForm from '@/app/ui/tags/tagUpdate';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let temp: unknown = await getTagByID(id);
  const tagData = temp as Tag[];

  //@ts-ignore
  const tag = tagData.getTagByID;
  console.log("~~~ ~~~ tag is:", tag);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tags', href: '/admin/tags' },
          {
            label: 'Edit Tags',
            href: `/admin/tags/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditTagForm tag={tag} />
    </main>
  );
}