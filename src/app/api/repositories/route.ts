import { NextRequest, NextResponse } from "next/server";
import { fetchCloudDatabase, saveCloudDatabase } from "@/lib/serverDb";
import { Repository } from "@/context/RepoContext";

export async function GET(req: NextRequest) {
  try {
    const db = await fetchCloudDatabase();
    const repos: Repository[] = db.repositories || [];

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const found = repos.find((r) => r.id === id);
      if (!found) {
        return NextResponse.json({ success: false, message: "Depo bulunamadı" }, { status: 404 });
      }
      return NextResponse.json({ success: true, repository: found });
    }

    return NextResponse.json({
      success: true,
      repositories: repos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Depolar getirilemedi.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const repo: Repository = body.repository;

    if (!repo || !repo.id || !repo.name) {
      return NextResponse.json(
        { success: false, message: "Geçersiz depo verisi." },
        { status: 400 }
      );
    }

    const db = await fetchCloudDatabase();
    const currentRepos = db.repositories || [];

    // Check if exists, replace or prepend
    const existingIndex = currentRepos.findIndex((r) => r.id === repo.id);
    let updatedRepos: Repository[];

    if (existingIndex !== -1) {
      updatedRepos = [...currentRepos];
      updatedRepos[existingIndex] = repo;
    } else {
      updatedRepos = [repo, ...currentRepos];
    }

    await saveCloudDatabase({ repositories: updatedRepos });

    return NextResponse.json({
      success: true,
      repository: repo,
      message: "Depo başarıyla buluta kaydedildi.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Depo kaydedilemedi.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { repository, repositories } = body;

    const db = await fetchCloudDatabase();
    let currentRepos = db.repositories || [];

    if (repositories && Array.isArray(repositories)) {
      // Bulk update
      await saveCloudDatabase({ repositories });
      return NextResponse.json({ success: true, message: "Depolar güncellendi." });
    }

    if (repository && repository.id) {
      const idx = currentRepos.findIndex((r) => r.id === repository.id);
      if (idx !== -1) {
        currentRepos[idx] = repository;
      } else {
        currentRepos.unshift(repository);
      }
      await saveCloudDatabase({ repositories: currentRepos });
      return NextResponse.json({ success: true, repository, message: "Depo güncellendi." });
    }

    return NextResponse.json({ success: false, message: "Geçersiz güncelleme verisi." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Güncelleme hatası.", error: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Depo ID belirtilmedi." }, { status: 400 });
    }

    const db = await fetchCloudDatabase();
    const currentRepos = db.repositories || [];
    const filtered = currentRepos.filter((r) => r.id !== id);

    await saveCloudDatabase({ repositories: filtered });

    return NextResponse.json({
      success: true,
      message: "Depo başarıyla silindi.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Depo silinemedi.", error: error?.message },
      { status: 500 }
    );
  }
}
