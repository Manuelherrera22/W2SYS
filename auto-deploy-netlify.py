#!/usr/bin/env python3
"""
Automatic Netlify Deployment Script for Watch Management System
This script automatically builds and deploys the project to Netlify
"""

import os
import sys
import json
import subprocess
import requests
import zipfile
from pathlib import Path

# Netlify Configuration
NETLIFY_API_TOKEN = "nfp_CyJB1R8sLhTxLvxxZp6cKq8oBPFekqffb832"
NETLIFY_API_URL = "https://api.netlify.com/api/v1"
SITE_NAME = "watch-management-system"

def print_header(message):
    print("\n" + "="*60)
    print(f"  {message}")
    print("="*60 + "\n")

def run_command(command, description):
    """Run a shell command and return the result"""
    print(f"📦 {description}...")
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during {description}")
        print(f"Error: {e.stderr}")
        return False

def install_dependencies():
    """Install npm dependencies"""
    return run_command("npm install", "Installing dependencies")

def build_project():
    """Build the Next.js project"""
    return run_command("npm run build", "Building project")

def create_zip(source_dir, output_filename):
    """Create a zip file of the build output"""
    print(f"📦 Creating deployment package...")
    
    source_path = Path(source_dir)
    if not source_path.exists():
        print(f"❌ Build directory '{source_dir}' not found")
        return None
    
    zip_path = Path(output_filename)
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in source_path.rglob('*'):
            if file_path.is_file():
                arcname = file_path.relative_to(source_path)
                zipf.write(file_path, arcname)
    
    print(f"✅ Deployment package created: {zip_path}")
    return zip_path

def create_netlify_site():
    """Create a new Netlify site"""
    headers = {
        "Authorization": f"Bearer {NETLIFY_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "name": SITE_NAME
    }
    
    print(f"🌐 Creating Netlify site: {SITE_NAME}...")
    
    try:
        response = requests.post(
            f"{NETLIFY_API_URL}/sites",
            headers=headers,
            json=data
        )
        
        if response.status_code == 201:
            site_data = response.json()
            print(f"✅ Site created successfully!")
            print(f"   Site ID: {site_data['id']}")
            print(f"   URL: {site_data['url']}")
            return site_data
        elif response.status_code == 422:
            # Site already exists, get it
            print(f"ℹ️  Site already exists, retrieving...")
            response = requests.get(
                f"{NETLIFY_API_URL}/sites",
                headers=headers
            )
            sites = response.json()
            for site in sites:
                if site['name'] == SITE_NAME:
                    print(f"✅ Found existing site!")
                    print(f"   Site ID: {site['id']}")
                    print(f"   URL: {site['url']}")
                    return site
            return None
        else:
            print(f"❌ Error creating site: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

def deploy_to_netlify(site_id, zip_path):
    """Deploy the zip file to Netlify"""
    headers = {
        "Authorization": f"Bearer {NETLIFY_API_TOKEN}",
        "Content-Type": "application/zip"
    }
    
    print(f"🚀 Deploying to Netlify...")
    
    try:
        with open(zip_path, 'rb') as f:
            response = requests.post(
                f"{NETLIFY_API_URL}/sites/{site_id}/deploys",
                headers=headers,
                data=f
            )
        
        if response.status_code in [200, 201]:
            deploy_data = response.json()
            print(f"✅ Deployment successful!")
            print(f"   Deploy ID: {deploy_data['id']}")
            print(f"   Deploy URL: {deploy_data['deploy_ssl_url']}")
            print(f"   Site URL: {deploy_data['ssl_url']}")
            return deploy_data
        else:
            print(f"❌ Deployment failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error during deployment: {str(e)}")
        return None

def main():
    print_header("Watch Management System - Netlify Auto-Deploy")
    
    # Step 1: Install dependencies
    print_header("Step 1: Installing Dependencies")
    if not install_dependencies():
        print("\n❌ Failed to install dependencies. Exiting.")
        return False
    
    # Step 2: Build the project
    print_header("Step 2: Building Project")
    if not build_project():
        print("\n❌ Build failed. Exiting.")
        return False
    
    # Step 3: Create deployment package
    print_header("Step 3: Creating Deployment Package")
    zip_path = create_zip("out", "deploy.zip")
    if not zip_path:
        print("\n❌ Failed to create deployment package. Exiting.")
        return False
    
    # Step 4: Create Netlify site
    print_header("Step 4: Creating Netlify Site")
    site = create_netlify_site()
    if not site:
        print("\n❌ Failed to create/retrieve Netlify site. Exiting.")
        return False
    
    # Step 5: Deploy to Netlify
    print_header("Step 5: Deploying to Netlify")
    deployment = deploy_to_netlify(site['id'], zip_path)
    
    # Cleanup
    if zip_path.exists():
        zip_path.unlink()
        print("\n🧹 Cleaned up deployment package")
    
    if deployment:
        print_header("🎉 Deployment Complete!")
        print(f"Your Watch Management System is now live at:")
        print(f"\n   🌐 {deployment['ssl_url']}\n")
        print(f"Deployment Details:")
        print(f"   • Site ID: {site['id']}")
        print(f"   • Deploy ID: {deployment['id']}")
        print(f"   • Status: {deployment['state']}")
        return True
    else:
        print("\n❌ Deployment failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)




