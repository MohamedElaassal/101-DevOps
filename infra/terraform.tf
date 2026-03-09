# Provider configuration - tells Terraform we're using Google Cloud Platform (GCP)
provider "google" {
  project = "freelancing-481612"  
  
  # Set your region here
  # TIP: Choose a region close to you for better performance (e.g., us-central1, europe-west1, asia-southeast1)
  # COMMON ERROR: Some regions may not have all machine types available
  region = "europe-west4"
  
  # Set your zone within the region
  # TIP: Zones are specific data centers within a region (e.g., us-central1-a, us-central1-b)
  zone = "europe-west4-a"
}

# Firewall rule for SSH access - equivalent to AWS security group
# This acts like a firewall to protect your GCP compute instance
resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh"
  network = "default"  # Uses the default VPC network

  # Allow SSH access on port 22
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  # Allow traffic from anywhere (equivalent to 0.0.0.0/0 in AWS)
  source_ranges = ["0.0.0.0/0"]
  
  # Apply this rule to instances with the "ssh-server" tag
  target_tags = ["ssh-server"]
}

# Firewall rule for application ports
resource "google_compute_firewall" "allow_app_ports" {
  name    = "allow-app-ports"
  network = "default"

  # RESEARCH TASK: Fill in the allow blocks to permit:
  # 1. Frontend access on port 3001 (for your React app)
  # 2. Backend access on port 3000 (for your Express API)
  #
  # TIP: Each allow block needs protocol and ports
  # COMMON ERROR: Forgetting to open these ports will make your applications inaccessible
  allow {
    protocol = "tcp"
    ports    = ["3000", "3001", "5432"]  # Backend and Frontend ports
  }

  # Allow traffic from anywhere
  source_ranges = ["0.0.0.0/0"]
  
  # Apply this rule to instances with the "web-server" tag
  target_tags = ["web-server"]
}

# Firewall rule for outbound traffic (egress) - GCP allows all egress by default
# This is equivalent to the egress rule in the AWS security group
# Note: GCP has an implicit "allow all egress" rule, so this is optional
resource "google_compute_firewall" "allow_all_egress" {
  name      = "allow-all-egress"
  network   = "default"
  direction = "EGRESS"

  # Allow all outbound traffic (equivalent to AWS egress rule)
  allow {
    protocol = "all"
  }

  destination_ranges = ["0.0.0.0/0"]
}

# Compute Engine instance - this is your virtual machine in the cloud
# This is equivalent to the EC2 instance in AWS
resource "google_compute_instance" "oneohone_devops_instance" {
  name         = "oneohone-devops-instance"
  machine_type = "e2-standard-2"  # This size is eligible for the free tier 
  zone         = "europe-west4-a"

  # RESEARCH TASK: Configure the boot disk with an appropriate image
  # TIP: Common images include "ubuntu-os-cloud/ubuntu-2204-lts", "debian-cloud/debian-11"
  # COMMON ERROR: Using wrong project/family format will cause image not found errors
  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"  # Ubuntu 22.04 LTS (Jammy)
      size  = 10  # 10GB disk size (free tier eligible)
    }
  }

  # Network interface configuration
  network_interface {
    network = "default"

    # RESEARCH TASK: Configure external IP access
    # TIP: access_config block is needed to assign an external IP
    # COMMON ERROR: Forgetting this block will create an instance without external IP
    access_config {
 
      # Leave empty for automatic assignment
    }
  }

  # RESEARCH TASK: Add SSH key metadata for secure access
  # TIP: Use the file() function to read your SSH public key
  # COMMON ERROR: Wrong SSH key format or path will prevent SSH access
  metadata = {
    # Option 1: Single user (replace 'yourusername' with your desired username)
    ssh-keys = "mohamedelaassal42:${file("~/.ssh/id_rsa.pub")}"
    
  }

  # Apply firewall rules by adding network tags
  # These correspond to the target_tags in our firewall rules
  tags = ["ssh-server", "web-server"]

  # Labels for easier identification
  labels = {
    environment = "development"
    project     = "oneohone-devops"
  }

  # RESEARCH TASK: Add startup script if needed
  # TIP: You can use metadata_startup_script to run commands when the instance boots
  # This is useful for installing Docker, setting up applications, etc.
  # metadata_startup_script = file("startup-script.sh")
}

# Output the external IP for SSH and application access
# This is equivalent to the public_ip output in AWS
output "external_ip" {
  description = "External IP address of the compute instance"
  # RESEARCH TASK: Find how to reference the external IP of your GCP instance
  # TIP: Use google_compute_instance resource name and network_interface attribute
  # COMMON ERROR: Misspelling attribute names will cause errors during apply
  value = google_compute_instance.oneohone_devops_instance.network_interface[0].access_config[0].nat_ip
}

# Additional useful outputs
output "instance_name" {
  description = "Name of the compute instance"
  value       = google_compute_instance.oneohone_devops_instance.name
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh your-username@${google_compute_instance.oneohone_devops_instance.network_interface[0].access_config[0].nat_ip}"
}

# RESEARCH TASKS SUMMARY:
# 1. Replace "your-gcp-project-id" with your actual GCP project ID
# 2. Replace "your-username" in metadata ssh-keys with your desired username
# 3. Update the SSH public key path in the file() function
# 4. Choose appropriate region and zone for your location
# 5. Optional: Add startup script for automated setup
#
# HELPFUL COMMANDS:
# - terraform init     # Initialize Terraform in this directory
# - terraform plan     # Preview changes before applying
# - terraform apply    # Create the infrastructure
# - terraform destroy  # Clean up resources when done
#
# COMMON ERRORS TO AVOID:
# - Forgetting to enable Compute Engine API in GCP Console
# - Using wrong project ID format
# - SSH key path not found or incorrect format
# - Choosing unavailable machine types in selected region