import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Paper {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  year: number;
  event: string;
  url: string;
}

const PapersManager = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);

  const [paperForm, setPaperForm] = useState({
    title: "",
    authors: "",
    abstract: "",
    year: new Date().getFullYear(),
    event: "",
    url: "",
  });

  useEffect(() => {
    const storedPapers = localStorage.getItem("papers");
    if (storedPapers) {
      setPapers(JSON.parse(storedPapers));
    }
  }, []);

  const savePapers = (updatedPapers: Paper[]) => {
    setPapers(updatedPapers);
    localStorage.setItem("papers", JSON.stringify(updatedPapers));
  };

  const handleSavePaper = () => {
    if (editingPaper) {
      const updatedPapers = papers.map((p) =>
        p.id === editingPaper.id ? { ...editingPaper, ...paperForm } : p
      );
      savePapers(updatedPapers);
      toast.success("Paper updated successfully");
    } else {
      const newPaper: Paper = {
        id: Date.now().toString(),
        ...paperForm,
      };
      savePapers([...papers, newPaper]);
      toast.success("Paper created successfully");
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeletePaper = (id: string) => {
    const updatedPapers = papers.filter((p) => p.id !== id);
    savePapers(updatedPapers);
    toast.success("Paper deleted successfully");
  };

  const openDialog = (paper?: Paper) => {
    if (paper) {
      setEditingPaper(paper);
      setPaperForm({
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        year: paper.year,
        event: paper.event,
        url: paper.url,
      });
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPaper(null);
    setPaperForm({
      title: "",
      authors: "",
      abstract: "",
      year: new Date().getFullYear(),
      event: "",
      url: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Papers Management</h2>
          <p className="text-muted-foreground">Manage research papers and publications</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Paper
        </Button>
      </div>

      {papers.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Authors</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {papers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {paper.title}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{paper.authors}</TableCell>
                    <TableCell>{paper.year}</TableCell>
                    <TableCell>{paper.event}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(paper)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePaper(paper.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No papers yet. Create your first paper to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* Paper Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPaper ? "Edit Paper" : "Create Paper"}</DialogTitle>
            <DialogDescription>
              {editingPaper ? "Update paper information" : "Add a new paper to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={paperForm.title}
                onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="authors">Authors</Label>
              <Input
                id="authors"
                placeholder="John Doe, Jane Smith"
                value={paperForm.authors}
                onChange={(e) => setPaperForm({ ...paperForm, authors: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                rows={4}
                value={paperForm.abstract}
                onChange={(e) => setPaperForm({ ...paperForm, abstract: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={paperForm.year}
                  onChange={(e) => setPaperForm({ ...paperForm, year: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="event">Event</Label>
                <Input
                  id="event"
                  value={paperForm.event}
                  onChange={(e) => setPaperForm({ ...paperForm, event: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={paperForm.url}
                onChange={(e) => setPaperForm({ ...paperForm, url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePaper}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PapersManager;
