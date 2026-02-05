"use client";

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Search,
  BookOpen,
  MessageSquare,
  Mail,
  FileText,
  Video,
  Link2,
} from "lucide-react";
import "@/styles/help.css";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({
    getting_started: true,
  });

  const faqs = [
    {
      category: "getting_started",
      categoryName: "Getting Started",
      icon: BookOpen,
      items: [
        {
          question: "How do I create a new note?",
          answer:
            "To create a new note, click the 'New Note' button in the sidebar or use the shortcut Ctrl+N. You can then add your content, organize it with tags and folders, and save it.",
        },
        {
          question: "How do I organize my notes with folders?",
          answer:
            "Navigate to the Folders section in the dashboard. Click 'Create Folder' to add a new folder. You can then create sub-folders and organize your notes hierarchically.",
        },
        {
          question: "What are tags and how do I use them?",
          answer:
            "Tags are labels you can assign to notes for better organization and quick filtering. Go to the Tags section, create tags with custom colors, and assign them to your notes.",
        },
      ],
    },
    {
      category: "features",
      categoryName: "Features & Usage",
      icon: FileText,
      items: [
        {
          question: "Can I share notes with others?",
          answer:
            "Yes! Each note has sharing options. You can generate a link to share with others, and control whether they can view or edit the note.",
        },
        {
          question: "How do I search for notes?",
          answer:
            "Use the search feature in the dashboard to find notes by title, content, tags, or folders. You can also filter by date range and other parameters.",
        },
        {
          question: "What is the version history feature?",
          answer:
            "Version history allows you to view and restore previous versions of your notes. Click on a note and select 'Version History' to see all changes.",
        },
        {
          question: "Can I export my notes?",
          answer:
            "Yes, you can export notes as PDF or Markdown files. Right-click on a note or use the export option from the note menu.",
        },
      ],
    },
    {
      category: "account",
      categoryName: "Account & Settings",
      icon: Mail,
      items: [
        {
          question: "How do I change my password?",
          answer:
            "Go to Security settings in your account. Click 'Change Password' and follow the instructions to set a new password.",
        },
        {
          question: "How can I reset my password if I forgot it?",
          answer:
            "On the login page, click 'Forgot Password?' and enter your email. You'll receive instructions to reset your password.",
        },
        {
          question: "Can I delete my account?",
          answer:
            "Yes, you can delete your account from Settings. Please note that this action is permanent and cannot be undone.",
        },
        {
          question: "How do I manage my profile?",
          answer:
            "Visit the Settings section to update your profile information, profile picture, and other personal details.",
        },
      ],
    },
    {
      category: "advanced",
      categoryName: "Advanced Features",
      icon: Video,
      items: [
        {
          question: "What are bulk actions?",
          answer:
            "Bulk actions allow you to perform operations on multiple notes at once, such as delete, move to folder, or assign tags.",
        },
        {
          question: "How do I use filters and sorting?",
          answer:
            "In various sections like Notes and Tags, you can use the filter panel to narrow down results and sort by different criteria.",
        },
        {
          question: "What is the activity report?",
          answer:
            "The activity report shows statistics about your notes, tags, and usage patterns. Visit the Report section to view detailed analytics.",
        },
      ],
    },
    {
      category: "troubleshooting",
      categoryName: "Troubleshooting",
      icon: MessageSquare,
      items: [
        {
          question: "Notes are not loading properly",
          answer:
            "Try refreshing the page or clearing your browser cache. If the issue persists, check your internet connection and try again.",
        },
        {
          question: "I can't create a new tag",
          answer:
            "Make sure the tag name doesn't already exist and is not too long (max 50 characters). Check for any validation errors displayed.",
        },
        {
          question: "Search is not showing all results",
          answer:
            "Try clearing the search filters and search again. Make sure you're not filtering by specific folders or date ranges unintentionally.",
        },
        {
          question: "How do I report a bug?",
          answer:
            "If you encounter a bug, please contact us via the support email at support@noteapp.com with details about the issue.",
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="help-page">
      <div className="help-container">
        {/* Header */}
        <div className="help-header">
          <div className="help-header-content">
            <HelpCircle className="help-header-icon" />
            <div className="help-header-text">
              <h1>Help & Documentation</h1>
              <p>Find answers to your questions and learn how to use NoteApp</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="help-search-section">
          <div className="help-search-wrapper">
            <Search className="help-search-icon" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="help-search-input"
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="help-content">
          {filteredFaqs.map(
            (category) =>
              category.items.length > 0 && (
                <div key={category.category} className="help-category">
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="help-category-header"
                  >
                    <div className="help-category-title">
                      <category.icon className="help-category-icon" />
                      <h2>{category.categoryName}</h2>
                    </div>
                    <ChevronDown
                      className={`help-chevron ${
                        expandedCategories[category.category] ? "expanded" : ""
                      }`}
                    />
                  </button>

                  {expandedCategories[category.category] && (
                    <div className="help-items">
                      {category.items.map((item, index) => (
                        <details
                          key={index}
                          className="help-item"
                        >
                          <summary className="help-question">
                            {item.question}
                          </summary>
                          <div className="help-answer">
                            <p>{item.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              )
          )}
        </div>

        {/* Additional Resources */}
        <div className="help-resources">
          <h2 className="help-resources-title">Additional Resources</h2>
          <div className="help-resources-grid">
            <div className="help-resource-card">
              <FileText className="help-resource-icon" />
              <h3>Documentation</h3>
              <p>Read our comprehensive documentation for detailed guides</p>
              <a href="#" className="help-resource-link">
                <span>Read Docs</span>
                <Link2 className="help-link-icon" />
              </a>
            </div>

            <div className="help-resource-card">
              <Video className="help-resource-icon" />
              <h3>Video Tutorials</h3>
              <p>Watch step-by-step video guides to learn features</p>
              <a href="#" className="help-resource-link">
                <span>Watch Videos</span>
                <Link2 className="help-link-icon" />
              </a>
            </div>

            <div className="help-resource-card">
              <MessageSquare className="help-resource-icon" />
              <h3>Community</h3>
              <p>Join our community forum to discuss with other users</p>
              <a href="#" className="help-resource-link">
                <span>Visit Community</span>
                <Link2 className="help-link-icon" />
              </a>
            </div>

            <div className="help-resource-card">
              <Mail className="help-resource-icon" />
              <h3>Contact Support</h3>
              <p>Can't find what you're looking for? Contact our support team</p>
              <a href="mailto:support@noteapp.com" className="help-resource-link">
                <span>Send Email</span>
                <Link2 className="help-link-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
